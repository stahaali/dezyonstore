import fs from "fs";

const man = JSON.parse(
  fs.readFileSync(
    "public/assets/images/optimized/products/_png-manifest.json",
    "utf8",
  ),
);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const laptopPicks = shuffle(
  man.laptops.filter((p) => p.includes("-v2.png")),
).slice(0, 5);
const desktopPicks = shuffle(man.desktops).slice(0, 5);

let src = fs.readFileSync("src/data/products.ts", "utf8");

function replaceImageUrlForId(text, id, url) {
  const re = new RegExp(
    `(id: "${id}"[\\s\\S]*?imageUrl: ")[^"]+(")`,
    "m",
  );
  if (!re.test(text)) throw new Error(`block not found ${id}`);
  return text.replace(re, `$1${url}$2`);
}

["lp1", "lp2", "lp3", "lp4", "lp5"].forEach((id, i) => {
  src = replaceImageUrlForId(src, id, laptopPicks[i]);
});
["dt1", "dt2", "dt3", "dt4", "dt5"].forEach((id, i) => {
  src = replaceImageUrlForId(src, id, desktopPicks[i]);
});

fs.writeFileSync("src/data/products.ts", src);
console.log({ laptopPicks, desktopPicks });
