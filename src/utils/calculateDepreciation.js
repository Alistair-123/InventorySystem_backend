export default function calculateDepreciation(price, purchaseDate) {
  const now = new Date();
  const purchase = new Date(purchaseDate);

  const yearsPassed = (now - purchase) / (1000 * 60 * 60 * 24 * 365);

  const depreciationRate = 0.20;

  let value = price - (price * depreciationRate * yearsPassed);

  if (value < 0) value = 0;

  return Math.round(value);
}