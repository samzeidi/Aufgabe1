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
  const tones = ["#C1A47D", "#AF916C", "#AD8C66", "#B8997A", "#927454", "#B39470"];
  const plankH = px / 10; // 20 cm planks
  for (let row = 0; row < 10; row++) {
    let u = -rnd() * px * 0.6;
    while (u < px) {
      const len = px * (0.4 + rnd() * 0.5);
      ctx.fillStyle = tones[Math.floor(rnd() * tones.length)];
      ctx.fillRect(u, row * plankH, len, plankH);
      // soft grain streaks
      ctx.globalAlpha = 0.08;
      for (let g = 0; g < 14; g++) {
        ctx.fillStyle = rnd() > 0.5 ? "#7a5c3c" : "#e0c9a6";
        const gy = row * plankH + rnd() * plankH;
        ctx.fillRect(u, gy, len, 1 + rnd() * 2);
      }
      ctx.globalAlpha = 1;
      // seams
      ctx.fillStyle = "rgba(60,40,25,0.35)";
      ctx.fillRect(u, row * plankH, 2, plankH);
      u += len;
    }
    ctx.fillStyle = "rgba(60,40,25,0.30)";
    ctx.fillRect(0, row * plankH, px, 2);
  }
  return finish(c, sizeUcm / 200, sizeVcm / 200);
}

/** 10 x 10 cm off-white tiles with grout. One texture tile = 100 x 100 cm. */
export function kitchenTileTexture(sizeUcm: number, sizeVcm: number) {
  const px = 512;
  const { c, ctx } = canvas(px, px);
  const rnd = mulberry32(3);
  ctx.fillStyle = "#B8B3A9";
  ctx.fillRect(0, 0, px, px);
  const n = 10;
  const t = px / n;
  const grout = 3;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = 0.94 + rnd() * 0.08;
      ctx.fillStyle = `rgb(${Math.round(221 * v)},${Math.round(215 * v)},${Math.round(202 * v)})`;
      ctx.fillRect(i * t + grout / 2, j * t + grout / 2, t - grout, t - grout);
    }
  }
  return finish(c, sizeUcm / 100, sizeVcm / 100);
}

/** Thin decorative tile strip. */
export function tileStripTexture(sizeUcm: number) {
  const px = 512;
  const { c, ctx } = canvas(px, 64);
  ctx.fillStyle = "#B8B3A9";
  ctx.fillRect(0, 0, px, 64);
  const n = 20;
  const t = px / n;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#C9BFA6" : "#9E8F78";
    ctx.fillRect(i * t + 2, 6, t - 4, 52);
    ctx.fillStyle = "#6F6350";
    ctx.beginPath();
    ctx.arc(i * t + t / 2, 32, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  return finish(c, sizeUcm / 100, 1);
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
  ctx.fillStyle = "#A97848";
  ctx.fillRect(0, 0, px, px);
  const tones = ["#93683E", "#B88959", "#C09567", "#A57346", "#B07E4E"];
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = 0.18 + rnd() * 0.25;
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
