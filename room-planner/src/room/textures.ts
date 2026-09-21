import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function finish(c: HTMLCanvasElement, repeatX: number, repeatY: number) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Oak planks running along U. One texture tile = 200 x 200 cm. */
export function oakFloorTexture(sizeUcm: number, sizeVcm: number) {
  const px = 1024;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(7);
  // light oak, low saturation: calibrated against pages 10/11 relative to the wall tone
  const tones = ["#D6BA9E", "#CDAF92", "#C6A88B", "#BE9F82", "#B3937A", "#D0B497"];
  const plankH = px / 10; // 20 cm planks
  for (let row = 0; row < 10; row++) {
    let u = -rnd() * px * 0.6;
    while (u < px) {
      const len = px * (0.4 + rnd() * 0.5);
      ctx.fillStyle = tones[Math.floor(rnd() * tones.length)];
      ctx.fillRect(u, row * plankH, len, plankH);
      // soft grain streaks
      ctx.globalAlpha = 0.06;
      for (let g = 0; g < 14; g++) {
        ctx.fillStyle = rnd() > 0.5 ? "#8a6d50" : "#eadbc4";
        const gy = row * plankH + rnd() * plankH;
        ctx.fillRect(u, gy, len, 1 + rnd() * 2);
      }
      ctx.globalAlpha = 1;
      // seams
      ctx.fillStyle = "rgba(70,50,35,0.28)";
      ctx.fillRect(u, row * plankH, 2, plankH);
      u += len;
    }
    ctx.fillStyle = "rgba(70,50,35,0.24)";
    ctx.fillRect(0, row * plankH, px, 2);
  }
  return finish(c, sizeUcm / 200, sizeVcm / 200);
}

/** 10 x 10 cm off-white tiles with grout. One texture tile = 100 x 100 cm. */
export function kitchenTileTexture(sizeUcm: number, sizeVcm: number) {
  const px = 512;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(3);
  ctx.fillStyle = "#C4BEB2";
  ctx.fillRect(0, 0, px, px);
  const n = 10;
  const t = px / n;
  const grout = 3;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = 0.95 + rnd() * 0.06;
      ctx.fillStyle = `rgb(${Math.round(232 * v)},${Math.round(226 * v)},${Math.round(210 * v)})`;
      ctx.fillRect(i * t + grout / 2, j * t + grout / 2, t - grout, t - grout);
    }
  }
  return finish(c, sizeUcm / 100, sizeVcm / 100);
}

/**
 * The real decorative border row: 10 cm tiles alternating tan and cream,
 * each with a dark brown horizontal oval. One texture tile = 100 cm.
 */
export function tileStripTexture(sizeUcm: number) {
  const px = 512;
  const h = 64;
  const { c, ctx } = canvas(px, h);
  ctx.fillStyle = "#B8B3A9";
  ctx.fillRect(0, 0, px, h);
  const n = 10;
  const t = px / n;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#C6B393" : "#E4DCCB";
    ctx.fillRect(i * t + 2, 3, t - 4, h - 6);
    ctx.fillStyle = "#4E3A2A";
    ctx.beginPath();
    ctx.ellipse(i * t + t / 2, h / 2, t * 0.19, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return finish(c, sizeUcm / 100, 1);
}

/** A plain coloured border band (for when the row is re-stickered). */
export function borderBandTexture(color: string, sizeUcm: number) {
  const px = 256;
  const h = 64;
  const { c, ctx } = canvas(px, h);
  ctx.fillStyle = "#B8B3A9";
  ctx.fillRect(0, 0, px, h);
  const n = 5;
  const t = px / n;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = color;
    ctx.fillRect(i * t + 2, 3, t - 4, h - 6);
  }
  return finish(c, sizeUcm / 100, 1);
}

export type BacksplashStyle = "original" | "plain" | "metro" | "zellige" | "checker" | "pattern";

function jitter(hex: string, amount: number, rnd: () => number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  const n = m ? parseInt(m[1], 16) : 0xdddddd;
  const f = 1 + (rnd() - 0.5) * amount;
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${clamp((n >> 16) & 255)},${clamp((n >> 8) & 255)},${clamp(n & 255)})`;
}

function darken(hex: string, factor: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  const n = m ? parseInt(m[1], 16) : 0xdddddd;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/**
 * Stick-on splashback tiles. One texture tile = 100 x 100 cm, so the
 * squares come out at a realistic 10 cm (20 x 10 for metro).
 */
export function backsplashTexture(
  style: Exclude<BacksplashStyle, "original">,
  tile: string,
  pattern: string,
  sizeUcm: number,
  sizeVcm: number,
) {
  const px = 512;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(17);
  const grout = darken(tile, style === "metro" ? 0.86 : 0.8);
  ctx.fillStyle = grout;
  ctx.fillRect(0, 0, px, px);

  if (style === "metro") {
    const bw = px / 5; // 20 cm
    const bh = px / 10; // 10 cm
    const g = 3;
    for (let row = 0; row < 10; row++) {
      const offset = row % 2 === 0 ? 0 : -bw / 2;
      for (let i = -1; i < 6; i++) {
        ctx.fillStyle = jitter(tile, 0.05, rnd);
        ctx.fillRect(i * bw + offset + g / 2, row * bh + g / 2, bw - g, bh - g);
      }
    }
  } else if (style === "zellige") {
    const t = px / 10;
    const g = 4;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ctx.fillStyle = jitter(tile, 0.22, rnd);
        const inset = rnd() * 2;
        ctx.fillRect(i * t + g / 2 + inset, j * t + g / 2 + inset, t - g - inset, t - g - inset);
        // glazed highlight
        ctx.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.12})`;
        ctx.fillRect(i * t + g, j * t + g, t - 2 * g, (t - 2 * g) * 0.35);
      }
    }
  } else if (style === "checker") {
    const t = px / 10;
    const g = 3;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? jitter(tile, 0.04, rnd) : jitter(pattern, 0.04, rnd);
        ctx.fillRect(i * t + g / 2, j * t + g / 2, t - g, t - g);
      }
    }
  } else if (style === "pattern") {
    const t = px / 5; // 20 cm patterned tiles
    const g = 3;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const x = i * t;
        const y = j * t;
        ctx.fillStyle = jitter(tile, 0.03, rnd);
        ctx.fillRect(x + g / 2, y + g / 2, t - g, t - g);
        ctx.save();
        ctx.translate(x + t / 2, y + t / 2);
        ctx.fillStyle = pattern;
        // four-petal motif
        for (let k = 0; k < 4; k++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.ellipse(0, -t * 0.22, t * 0.1, t * 0.19, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, t * 0.08, 0, Math.PI * 2);
        ctx.fill();
        // corner quarter-circles
        ctx.globalAlpha = 0.75;
        for (let k = 0; k < 4; k++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.arc(-t / 2, -t / 2, t * 0.14, 0, Math.PI / 2);
          ctx.lineTo(-t / 2, -t / 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  } else {
    // plain squares
    const t = px / 10;
    const g = 3;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ctx.fillStyle = jitter(tile, 0.045, rnd);
        ctx.fillRect(i * t + g / 2, j * t + g / 2, t - g, t - g);
      }
    }
  }

  return finish(c, sizeUcm / 100, sizeVcm / 100);
}

/** Subtle plaster noise, for walls/ceiling. */
export function plasterTexture(base: string, sizeUcm: number, sizeVcm: number) {
  const px = 256;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(11);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, px, px);
  const img = ctx.getImageData(0, 0, px, px);
  for (let i = 0; i < img.data.length; i += 4) {
    const d = (rnd() - 0.5) * 9;
    img.data[i] += d;
    img.data[i + 1] += d;
    img.data[i + 2] += d;
  }
  ctx.putImageData(img, 0, 0);
  return finish(c, sizeUcm / 100, sizeVcm / 100);
}

/** Vertical beech wood grain for cabinet fronts. One tile = 60 x 60 cm. */
export function beechTexture() {
  const px = 512;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(5);
  // beech: yellow-tan, calibrated against pages 6/7/14
  ctx.fillStyle = "#C09A6C";
  ctx.fillRect(0, 0, px, px);
  const tones = ["#AE8A5E", "#C9A575", "#D1AF82", "#B69064", "#C49F70"];
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = 0.15 + rnd() * 0.22;
    ctx.fillStyle = tones[Math.floor(rnd() * tones.length)];
    const x = rnd() * px;
    ctx.fillRect(x, 0, 1 + rnd() * 5, px);
  }
  ctx.globalAlpha = 1;
  return finish(c, 1, 1);
}

/** Black ceramic cooktop with four faint rings. */
export function cooktopTexture() {
  const px = 512;
  const { c, ctx } = canvas(px, px);
  ctx.fillStyle = "#121314";
  ctx.fillRect(0, 0, px, px);
  ctx.strokeStyle = "#3a3c3d";
  ctx.lineWidth = 3;
  const centers: [number, number, number][] = [
    [140, 150, 75],
    [372, 150, 60],
    [140, 372, 55],
    [372, 372, 80],
  ];
  for (const [x, y, r] of centers) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
    ctx.stroke();
  }
  return finish(c, 1, 1);
}

/** Frosted glass for the hood cabinet: mostly opaque, brushed. */
export function frostedTexture() {
  const px = 128;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(9);
  ctx.fillStyle = "#c9ccc9";
  ctx.fillRect(0, 0, px, px);
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.15})`;
    ctx.fillRect(rnd() * px, rnd() * px, 1, rnd() * 20);
  }
  return finish(c, 1, 1);
}
