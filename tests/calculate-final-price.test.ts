import { describe, expect, it } from "vitest";
import { calculateFinalPrice } from "../src/lib/pricing/calculate-final-price";
describe("calculateFinalPrice", () => {
  it("calculates percentage discount", () =>
    expect(calculateFinalPrice(100000, "percentage", 10)).toEqual({
      discount: 10000,
      finalAmount: 90000,
    }));
  it("never returns negative final amount", () =>
    expect(calculateFinalPrice(10000, "fixed", 50000).finalAmount).toBe(0));
});
