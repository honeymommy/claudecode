export function salePrice(landedCost, p) {
  const raw = landedCost * p.multiplier;
  const price = Math.floor(raw) + p.roundTo;
  return Number((price < raw ? price + 1 : price).toFixed(2));
}

export function profit(price, landedCost, p) {
  return Number((price - landedCost - price * p.ebayFeeRate - p.ebayFixedFee).toFixed(2));
}

// Returns the listing price, or null when the item isn't worth selling.
export function priceFor(landedCost, p) {
  const price = salePrice(landedCost, p);
  return profit(price, landedCost, p) >= p.minProfit ? price : null;
}
