import type { Product } from "@/types";

/** Normalize plurals / punctuation for matching. */
function normalizeToken(token: string) {
  const t = token
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, "")
    .trim();
  if (t.length > 3 && t.endsWith("ies")) return `${t.slice(0, -3)}y`;
  if (t.length > 3 && t.endsWith("sses")) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

function tokenize(query: string) {
  return query
    .toLowerCase()
    .split(/[\s,/|+-]+/)
    .map(normalizeToken)
    .filter((t) => t.length > 1);
}

function wordMatch(haystack: string, token: string) {
  if (!token) return false;
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(?:^|[^a-z0-9])${escaped}(?:s|es)?(?:[^a-z0-9]|$)`,
    "i",
  ).test(haystack);
}

function nameSlugText(p: Product) {
  return `${p.name} ${p.slug} ${p.shortDescription}`.toLowerCase();
}

type IntentRule = {
  phrases: string[];
  match: (p: Product) => boolean;
};

/**
 * Exact product-type intents. Prefer catalog id prefixes used by the store
 * so dummy / mistagged products (wrong images) do not pollute results.
 */
const INTENT_RULES: IntentRule[] = [
  {
    phrases: ["laptop", "laptops", "notebook", "notebooks"],
    match: (p) => p.id.startsWith("lp") && p.categorySlug === "laptops",
  },
  {
    phrases: [
      "desktop",
      "desktops",
      "desktop pc",
      "desktop pcs",
      "all in one",
      "all-in-one",
      "aio",
      "lcd",
      "lcds",
      "led",
      "leds",
      "lcd monitor",
      "lcd monitors",
    ],
    match: (p) => p.id.startsWith("dt") && p.categorySlug === "desktop-pcs",
  },
  {
    phrases: ["server", "servers"],
    match: (p) => p.id.startsWith("sv") && p.categorySlug === "servers",
  },
  {
    phrases: ["gaming pc", "gaming pcs", "gaming desktop"],
    match: (p) => p.id.startsWith("gp") && p.categorySlug === "gaming-pcs",
  },
  {
    phrases: ["gaming accessories", "gaming accessory"],
    match: (p) =>
      /^ga\d+$/.test(p.id) && p.categorySlug === "gaming-accessories",
  },
  {
    phrases: ["peripheral", "peripherals"],
    match: (p) =>
      /^pe\d+$/.test(p.id) && p.categorySlug === "peripherals",
  },
  {
    phrases: ["razer", "razer products", "razer product"],
    match: (p) =>
      /^rz\d+$/.test(p.id) && p.categorySlug === "razer-products",
  },
  {
    phrases: ["mouse", "mice"],
    match: (p) => {
      const text = nameSlugText(p);
      if (/\bmouse\s*pad\b/.test(text) || /\bcombo\b/.test(text)) return false;
      const isMouse =
        /\bmouse\b/.test(text) ||
        /\bmice\b/.test(text) ||
        p.categorySlug === "mouse";
      return (
        isMouse &&
        (p.id.startsWith("pe") ||
          p.id.startsWith("ga") ||
          p.categorySlug === "mouse")
      );
    },
  },
  {
    phrases: ["keyboard", "keyboards"],
    match: (p) => {
      const text = nameSlugText(p);
      if (/\bcombo\b/.test(text) && !/\bkeyboard\b/.test(text)) return false;
      return (
        /\bkeyboard\b/.test(text) &&
        !/\bmouse\s*pad\b/.test(text) &&
        (p.id.startsWith("pe") ||
          p.id.startsWith("ga") ||
          p.categorySlug === "keyboards")
      );
    },
  },
  {
    phrases: ["headset", "headsets", "headphone", "headphones"],
    match: (p) => {
      const text = nameSlugText(p);
      return (
        (/\bheadset\b/.test(text) || /\bheadphone\b/.test(text)) &&
        (p.id.startsWith("pe") || p.id.startsWith("ga"))
      );
    },
  },
  {
    phrases: ["monitor", "monitors"],
    match: (p) => /\bmonitor\b/.test(nameSlugText(p)),
  },
];

function resolveIntent(query: string): IntentRule | null {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return null;

  // Longer phrases first
  const ordered = [...INTENT_RULES].sort(
    (a, b) =>
      Math.max(...b.phrases.map((p) => p.length)) -
      Math.max(...a.phrases.map((p) => p.length)),
  );

  for (const rule of ordered) {
    for (const phrase of rule.phrases) {
      if (q === phrase || q === `${phrase}s`) return rule;
      if (normalizeToken(phrase) === normalizeToken(q) && !q.includes(" ")) {
        return rule;
      }
    }
  }

  return null;
}

function scoreProduct(product: Product, tokens: string[]) {
  // Skip demo placeholder catalog items (wrong/random images)
  if (/^p\d+$/i.test(product.id)) return 0;

  const name = product.name.toLowerCase();
  const brand = product.brandName.toLowerCase();
  const slug = `${product.slug} ${product.categorySlug}`.toLowerCase();
  const short = product.shortDescription.toLowerCase();
  const tags = (product.tags ?? []).join(" ").toLowerCase();

  let score = 0;
  let matchedAll = true;

  for (const token of tokens) {
    let hit = false;
    if (wordMatch(name, token)) {
      score += 50;
      hit = true;
    }
    if (wordMatch(brand, token)) {
      score += 25;
      hit = true;
    }
    if (wordMatch(slug, token)) {
      score += 30;
      hit = true;
    }
    if (wordMatch(tags, token)) {
      score += 12;
      hit = true;
    }
    if (wordMatch(short, token)) {
      score += 10;
      hit = true;
    }
    if (!hit) matchedAll = false;
  }

  if (!matchedAll) return 0;
  if (score < 25) return 0;
  return score;
}

export function filterProductsByQuery(products: Product[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return products.filter((p) => !/^p\d+$/i.test(p.id));
  }

  const intent = resolveIntent(trimmed);
  if (intent) {
    return products.filter(intent.match);
  }

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return products.filter((p) => !/^p\d+$/i.test(p.id));

  return products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.product);
}
