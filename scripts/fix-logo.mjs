import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import sharp from "sharp";
import fs from "node:fs";

const outWebp = "public/assets/images/optimized/dezyonstore-logo.webp";
const outWebpV2 = "public/assets/images/optimized/dezyonstore-logo-v2.webp";
const outJpg = "public/assets/images/optimized/dezyonstore-logo.jpg";
const outJpgV2 = "public/assets/images/optimized/dezyonstore-logo-v2.jpg";
const outPublicJpg = "public/assets/images/dezyonstore-logo.jpg";

GlobalFonts.registerFromPath(
  "C:/Windows/Fonts/Coolvetica Rg Cond.otf",
  "LogoCond",
);
GlobalFonts.registerFromPath("C:/Windows/Fonts/ARIALNB.TTF", "ArialNarrowBold");

const BLUE = "#00498e";
const YELLOW = "#ffc20a";
const WHITE = "#ffffff";
const fontFamily = GlobalFonts.has("LogoCond") ? "LogoCond" : "ArialNarrowBold";

const dezyon = "DEZYON";
const store = "STORE";
const fontSize = 240;

/** Render text and return ink bounding box relative to alphabetic baseline at (ox, oy). */
function measureInk(text) {
  const ox = 100;
  const oy = Math.ceil(fontSize * 1.5);
  const w = Math.ceil(fontSize * text.length * 0.8) + 200;
  const h = Math.ceil(fontSize * 3);
  const c = createCanvas(w, h);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, w, h);
  ctx.font = `700 ${fontSize}px "${fontFamily}"`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, ox, oy);
  const { data } = ctx.getImageData(0, 0, w, h);
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // ink is near-white
      if (data[i] < 200) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return {
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    ascent: oy - minY,
    descent: maxY - oy,
  };
}

const dezyonInk = measureInk(dezyon);
const storeInk = measureInk(store);
const letterH = Math.max(dezyonInk.height, storeInk.height);
const ascent = Math.max(dezyonInk.ascent, storeInk.ascent);
const letterWDezyon = dezyonInk.width;
const letterWStore = storeInk.width;

const leftPad = 40;
const yellowPadX = 36;
const vPad = Math.max(48, Math.round(letterH * 0.25));
const H = Math.ceil(letterH + vPad * 2);
const yellowLeft = leftPad + letterWDezyon + 4;
const W = yellowLeft + letterWStore + yellowPadX * 2;

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

ctx.fillStyle = BLUE;
ctx.fillRect(0, 0, W, H);
ctx.fillStyle = YELLOW;
ctx.fillRect(yellowLeft, 0, W - yellowLeft, H);

ctx.font = `700 ${fontSize}px "${fontFamily}"`;
ctx.textBaseline = "alphabetic";
ctx.textAlign = "left";
const baselineY = vPad + ascent;

ctx.fillStyle = WHITE;
ctx.fillText(dezyon, leftPad, baselineY);
ctx.fillStyle = BLUE;
ctx.fillText(store, yellowLeft + yellowPadX, baselineY);

const png = canvas.toBuffer("image/png");
await sharp(png).webp({ quality: 96, effort: 6 }).toFile(outWebp);
await sharp(png).webp({ quality: 96, effort: 6 }).toFile(outWebpV2);
await sharp(png).jpeg({ quality: 95 }).toFile(outJpg);
await sharp(png).jpeg({ quality: 95 }).toFile(outJpgV2);
await sharp(png).jpeg({ quality: 95 }).toFile(outPublicJpg);

for (const p of [
  "public/assets/images/optimized/_store-check.png",
  "public/assets/images/optimized/_logo-fresh.png",
  "public/assets/images/optimized/_store-preview.png",
  "public/assets/images/optimized/dezyonstore-logo-check.png",
]) {
  try {
    fs.unlinkSync(p);
  } catch {
    /* ignore */
  }
}

const { data, info } = await sharp(outWebp)
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

let dMinY = info.height;
let dMaxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = yellowLeft; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    if (data[i] < 40 && data[i + 1] < 100 && data[i + 2] > 100) {
      if (y < dMinY) dMinY = y;
      if (y > dMaxY) dMaxY = y;
    }
  }
}

console.log({
  font: fontFamily,
  size: `${info.width}x${info.height}`,
  ink: { dezyon: dezyonInk, store: storeInk },
  storePadTop: dMinY,
  storePadBot: info.height - 1 - dMaxY,
});
