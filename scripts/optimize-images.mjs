import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "assets", "images");
const OUT = path.join(ROOT, "optimized");

const WEBP_OPTS = { quality: 80, effort: 4 };
const RASTER_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".tif",
  ".tiff",
]);

const NAMED_ASSETS = [
  { pattern: /imgi?_134_processors/i, out: "categories/processors.webp" },
  { pattern: /imgi?_135_tablets/i, out: "categories/tablets.webp" },
  { pattern: /imgi?_136_cameras/i, out: "categories/cameras.webp" },
  { pattern: /imgi?_137_headphones/i, out: "categories/headsets.webp" },
  { pattern: /imgi?_138_gaming-chair/i, out: "categories/gaming-furniture.webp" },
  { pattern: /imgi?_139_consoles/i, out: "categories/consoles.webp" },
  { pattern: /imgi?_140_smart-watches/i, out: "categories/wearables.webp" },
  { pattern: /imgi?_141_keyboards/i, out: "categories/keyboards.webp" },
  { pattern: /imgi?_133_laptops/i, out: "categories/laptops.webp" },
  { pattern: /imgi?_132_cooling/i, out: "categories/cooling.webp" },
  { pattern: /imgi?_10_laptops/i, out: "categories/laptops.webp" },
  { pattern: /imgi?_11_processors/i, out: "categories/processors.webp" },
  { pattern: /imgi?_12_tablets/i, out: "categories/tablets.webp" },
  { pattern: /imgi?_13_cameras/i, out: "categories/cameras.webp" },
  { pattern: /imgi?_14_headphones/i, out: "categories/headsets.webp" },
  { pattern: /imgi?_15_gaming-chair/i, out: "categories/gaming-furniture.webp" },
  { pattern: /imgi?_16_consoles/i, out: "categories/consoles.webp" },
  { pattern: /imgi?_17_smart-watches/i, out: "categories/wearables.webp" },
  { pattern: /imgi?_18_keyboards/i, out: "categories/keyboards.webp" },
  { pattern: /imgi?_9_cooling/i, out: "categories/cooling.webp" },
  { pattern: /^banner\.webp$/i, out: "banners/main.webp" },
  { pattern: /imgi?_7_Untitled-design-87161-280426/i, out: "banners/hero-main.webp" },
  { pattern: /imgi?_130_Untitled-design-87161-280426/i, out: "banners/hero-headphones.webp" },
  { pattern: /imgi?_114_czone-20260209115151/i, out: "banners/hero-model.webp" },
  { pattern: /imgi?_125_Copy-of-Monitors/i, out: "banners/hero-monitors.webp" },
  { pattern: /imgi?_127_sony/i, out: "banners/hero-sony.webp" },
  { pattern: /imgi?_128_L04-slider/i, out: "banners/hero-gaming.webp" },
  { pattern: /imgi?_122_czone-20260206080541/i, out: "banners/pcie-cable.webp" },
  { pattern: /steelseries-bg/i, out: "banners/steelseries-bg.webp" },
  { pattern: /steelseries-banner/i, out: "banners/steelseries-banner.webp" },
  { pattern: /steelseries-peripherals/i, out: "banners/steelseries-peripherals.webp" },
  { pattern: /steelseries-products/i, out: "banners/steelseries-products.webp" },
  { pattern: /used-laptops-banner/i, out: "banners/used-laptops-banner.webp" },
  { pattern: /imgi?_129_Used-laptops/i, out: "banners/laptop-cutout.webp" },
  { pattern: /imgi?_6_Used-laptops/i, out: "banners/combo.webp" },
  { pattern: /imgi?_8_Untitled-design-87161-170126/i, out: "banners/gaming-accessories.webp" },
  { pattern: /imgi?_5_L04-slider/i, out: "banners/slider.webp" },
  { pattern: /imgi?_142_Comfort-Crafted/i, out: "banners/gaming-chair.webp" },
  { pattern: /dezyonstore-logo/i, out: "dezyonstore-logo.webp" },
  { pattern: /^01\.png$/i, out: "logo-source.webp" },
  { pattern: /^logo\.webp$/i, out: "logo.webp" },
];

const PRODUCT_PATTERN =
  /^(imgi_|imgj_)\d+_(?:czone|czone\.com\.pk|czone-2\.com\.pk|10-czone|13-czone|43-czone|46-czone|8-czone)/i;

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function collectSourceFiles(dir, relative = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "optimized") continue;

    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(full, rel)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (RASTER_EXT.has(ext)) files.push(rel);
  }

  return files;
}

async function toWebp(inputPath, outputPath, { maxWidth = 1200 } = {}) {
  await ensureDir(outputPath);

  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath).rotate();

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.webp(WEBP_OPTS).toFile(outputPath);
  const stat = await fs.stat(outputPath);
  return stat.size;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const files = await collectSourceFiles(ROOT);
  const usedSources = new Set();
  const usedOutputs = new Set();
  const manifest = { categories: {}, banners: {}, products: [], logo: "" };

  let totalIn = 0;
  let totalOut = 0;

  for (const { pattern, out } of NAMED_ASSETS) {
    const match = files.find(
      (f) => pattern.test(path.basename(f)) && !f.endsWith(".svg"),
    );
    if (!match || usedOutputs.has(out)) continue;

    const input = path.join(ROOT, match);
    const output = path.join(OUT, out);
    const inStat = await fs.stat(input);
    const outSize = await toWebp(input, output, { maxWidth: 1600 });
    usedSources.add(match);
    usedOutputs.add(out);
    totalIn += inStat.size;
    totalOut += outSize;

    const webPath = `/assets/images/optimized/${out.replace(/\\/g, "/")}`;
    if (out.startsWith("categories/")) {
      manifest.categories[path.basename(out, ".webp")] = webPath;
    } else if (out.startsWith("banners/")) {
      manifest.banners[path.basename(out, ".webp")] = webPath;
    } else if (out === "logo.webp" || out === "dezyonstore-logo.webp") {
      manifest.logo = webPath;
    }

    console.log(
      `✓ ${match} → ${out} (${(inStat.size / 1024).toFixed(1)} KB → ${(outSize / 1024).toFixed(1)} KB)`,
    );
  }

  const productFiles = files
    .filter((f) => !usedSources.has(f) && PRODUCT_PATTERN.test(path.basename(f)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  let index = 1;
  for (const file of productFiles) {
    const out = `products/product-${String(index).padStart(3, "0")}.webp`;
    const input = path.join(ROOT, file);
    const output = path.join(OUT, out);
    const inStat = await fs.stat(input);
    const outSize = await toWebp(input, output);
    usedSources.add(file);
    totalIn += inStat.size;
    totalOut += outSize;
    manifest.products.push(`/assets/images/optimized/${out}`);
    if (index <= 5 || index % 50 === 0) {
      console.log(
        `✓ ${file} → ${out} (${(inStat.size / 1024).toFixed(1)} KB → ${(outSize / 1024).toFixed(1)} KB)`,
      );
    }
    index++;
  }

  const remaining = files
    .filter((f) => !usedSources.has(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const file of remaining) {
    const base = path
      .basename(file, path.extname(file))
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
    const out = `misc/${base}.webp`;
    const input = path.join(ROOT, file);
    const output = path.join(OUT, out);
    const inStat = await fs.stat(input);
    const outSize = await toWebp(input, output);
    totalIn += inStat.size;
    totalOut += outSize;
    console.log(
      `✓ ${file} → ${out} (${(inStat.size / 1024).toFixed(1)} KB → ${(outSize / 1024).toFixed(1)} KB)`,
    );
  }

  const manifestPath = path.join(process.cwd(), "src", "data", "site-assets.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  const saved = totalIn > 0 ? ((1 - totalOut / totalIn) * 100).toFixed(1) : "0";
  console.log(`\nDone.`);
  console.log(`  Products: ${manifest.products.length}`);
  console.log(`  Misc/other: ${remaining.length}`);
  console.log(
    `  Size: ${(totalIn / 1024 / 1024).toFixed(2)} MB → ${(totalOut / 1024 / 1024).toFixed(2)} MB (${saved}% smaller)`,
  );
  console.log(`  Manifest → src/data/site-assets.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
