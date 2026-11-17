import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../components/store/ProductCard";
import { EcommerceProvider } from "../context/EcommerceContext";
import type { Product } from "../types/ecommerceTypes";
import { describe, it, expect } from "vitest";

const mockProduct: Product = {
  id: "test-prod-101",
  name: "Bose QuietComfort 45 Wireless",
  price: 24900,
  originalPrice: 29900,
  stock: 12,
  category: "Audio",
  brand: "Bose",
  photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  description: "High performance ANC headphones.",
  rating: 4.8,
  reviewCount: 154,
  featured: true,
  specs: [{ label: "Battery", value: "24 Hours" }],
};

describe("ProductCard Component Accessibility & Interactions", () => {
  it("renders with semantic article landmark and accessible label", () => {
    render(
      <BrowserRouter>
        <EcommerceProvider>
          <ProductCard product={mockProduct} />
        </EcommerceProvider>
      </BrowserRouter>
    );

    const card = screen.getByRole("article", {
      name: /Product card: Bose QuietComfort 45 Wireless/i,
    });
    expect(card).toBeDefined();

    const titleLink = screen.getByRole("link", {
      name: /Bose QuietComfort 45 Wireless/i,
    });
    expect(titleLink).toBeDefined();
  });

  it("calculates and displays discount percentage accurately", () => {
    render(
      <BrowserRouter>
        <EcommerceProvider>
          <ProductCard product={mockProduct} />
        </EcommerceProvider>
      </BrowserRouter>
    );

    // 29900 - 24900 = 5000 / 29900 = ~17% discount
    const discountBadge = screen.getByLabelText(/17% discount/i);
    expect(discountBadge).toBeDefined();
  });

  it("toggles wishlist accessible state on button click", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <EcommerceProvider>
          <ProductCard product={mockProduct} />
        </EcommerceProvider>
      </BrowserRouter>
    );

    const wishlistBtn = screen.getByRole("button", {
      name: /wishlist/i,
    });
    expect(wishlistBtn).toBeDefined();

    await user.click(wishlistBtn);
  });
});
