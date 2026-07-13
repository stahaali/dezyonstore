export type CurrencyCode = "CAD" | "USD";

/** Format catalog price with $ for both CAD and USD. */
export function formatPriceDollar(
  price: number,
  currency: CurrencyCode = "CAD",
) {
  // Same $ symbol for CAD and USD (en-CA/en-US narrowSymbol).
  return new Intl.NumberFormat(currency === "CAD" ? "en-CA" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/** @deprecated Use formatPriceDollar — kept for existing imports. */
export function formatPricePKR(price: number) {
  return formatPriceDollar(price, "CAD");
}
