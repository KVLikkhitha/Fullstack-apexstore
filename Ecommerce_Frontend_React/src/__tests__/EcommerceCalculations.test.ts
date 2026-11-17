import { describe, it, expect } from "vitest";

// Calculations matching EcommerceContext & CartPage logic
export const calculateTax = (subtotal: number, taxRate = 0.05) => {
  return Math.round(subtotal * taxRate);
};

export const calculateShipping = (subtotal: number, threshold = 1500, flatFee = 150) => {
  if (subtotal === 0 || subtotal >= threshold) return 0;
  return flatFee;
};

export const calculateDiscount = (
  subtotal: number,
  coupon?: { discountPercent: number; maxDiscount?: number; minSpend?: number } | null
) => {
  if (!coupon || subtotal <= 0) return 0;
  if (coupon.minSpend && subtotal < coupon.minSpend) return 0;

  const rawDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
  if (coupon.maxDiscount && rawDiscount > coupon.maxDiscount) {
    return coupon.maxDiscount;
  }
  return rawDiscount;
};

export const calculateGrandTotal = (
  subtotal: number,
  tax: number,
  shipping: number,
  discount: number
) => {
  return Math.max(0, subtotal + tax + shipping - discount);
};

describe("Ecommerce Pricing & Calculation Unit Tests", () => {
  describe("Tax Calculation", () => {
    it("should calculate 5% GST rounded to nearest integer", () => {
      expect(calculateTax(10000)).toBe(500);
      expect(calculateTax(8999)).toBe(450); // 8999 * 0.05 = 449.95 -> 450
      expect(calculateTax(0)).toBe(0);
    });
  });

  describe("Shipping Threshold", () => {
    it("should charge ₹150 flat shipping for orders under ₹1,500", () => {
      expect(calculateShipping(999)).toBe(150);
      expect(calculateShipping(1499)).toBe(150);
    });

    it("should provide FREE shipping for orders >= ₹1,500", () => {
      expect(calculateShipping(1500)).toBe(0);
      expect(calculateShipping(8999)).toBe(0);
    });

    it("should charge 0 shipping when cart is empty", () => {
      expect(calculateShipping(0)).toBe(0);
    });
  });

  describe("Coupon & Promotional Discounts", () => {
    const coupon10 = { discountPercent: 10, maxDiscount: 2000, minSpend: 1000 };
    const super50 = { discountPercent: 50, maxDiscount: 5000, minSpend: 5000 };

    it("should calculate percentage discount correctly", () => {
      expect(calculateDiscount(2000, coupon10)).toBe(200); // 10% of 2000
    });

    it("should cap discount at maxDiscount limit", () => {
      // 10% of 50000 is 5000, but maxDiscount is 2000
      expect(calculateDiscount(50000, coupon10)).toBe(2000);
    });

    it("should return 0 discount if minimum spend is not met", () => {
      expect(calculateDiscount(500, coupon10)).toBe(0);
      expect(calculateDiscount(3000, super50)).toBe(0); // requires 5000
    });

    it("should return 0 discount when no coupon is applied", () => {
      expect(calculateDiscount(10000, null)).toBe(0);
    });
  });

  describe("Grand Total Integrity", () => {
    it("should compute subtotal + tax + shipping - discount accurately", () => {
      const subtotal = 10000;
      const tax = calculateTax(subtotal); // 500
      const shipping = calculateShipping(subtotal); // 0 (>= 1500)
      const discount = calculateDiscount(subtotal, { discountPercent: 20, maxDiscount: 4000 }); // 2000

      const total = calculateGrandTotal(subtotal, tax, shipping, discount);
      expect(total).toBe(8500); // 10000 + 500 + 0 - 2000 = 8500
    });

    it("should never produce a negative grand total", () => {
      const total = calculateGrandTotal(100, 5, 0, 500);
      expect(total).toBe(0);
    });
  });
});
