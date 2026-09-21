// Produces the validation renders (top-down plan, dimensioned plan, and the
// four photo-matching perspectives) from the production build.
//
//   npm run build && npm run render:checks
//
// Requires playwright (devDependency) and a Chromium it can launch: either
// `npx playwright install chromium`, or set CHROME_PATH to an existing binary.

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "renders");
const PORT = 5197;
const LENS = process.env.LENS ?? "14";
const LOOK = process.env.LOOK ?? "as-is";

// [view, file name, portrait?, dimension labels?]
const SHOTS = [
  ["top", "01-top-plan", true, false],
  ["top", "02-top-plan-dimensioned", true, true],
  ["kitchen", "03-kitchen-p6-7", true, false],
  ["bed", "04-bed-p10-11", true, false],
  ["table", "05-table-window-p12", true, false],
  ["kitchenAlong", "06-along-kitchen-p14-15", true, false],
  ["overview", "07-overview", false, false],
];

mkdirSync(OUT, { recursive: true });

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: ROOT,
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 2500));

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

try {
  for (const [view, name, portrait, dims] of SHOTS) {
    const page = await browser.newPage({
      viewport: portrait ? { width: 900, height: 1200 } : { width: 1400, height: 1000 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => console.error(`[${name}] pageerror`, e.message));
    await page.addInitScript(
      ({ lens }) => {
        localStorage.setItem(
          "room-planner-v2",
          JSON.stringify({
            state: {
              settings: { unit: "m", wallOpacity: 1, showCeiling: true, showDimensions: false, showExterior: true, lens: Number(lens) },
              products: [],
            },
            version: 0,
          }),
        );
      },
      { lens: LENS },
    );
    // "as-is" keeps the check renders showing the real flat rather than a decorated look
    const dimsParam = view === "top" && !dims ? "&dims=0" : "";
    await page.goto(`http://localhost:${PORT}/?view=${view}&ui=0&look=${LOOK}${dimsParam}`, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas");
    await page.waitForTimeout(4500);
    await page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 88 });
    console.log("saved", name);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
