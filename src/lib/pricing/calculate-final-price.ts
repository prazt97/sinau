export function calculateFinalPrice(
  price: number,
  discountType?: "percentage" | "fixed",
  discountValue = 0,
) {
  const discount =
    discountType === "percentage"
      ? (price * discountValue) / 100
      : discountType === "fixed"
        ? discountValue
        : 0;
  return {
    discount: Math.min(price, Math.max(0, discount)),
    finalAmount: Math.max(0, price - discount),
  };
}
