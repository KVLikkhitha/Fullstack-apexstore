import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaArrowLeft,
  FaTag,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";

const CartPage = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
  } = useEcommerce();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState<string>("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCharges = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    const rawDiscount = Math.round(
      (subtotal * appliedCoupon.discountPercent) / 100
    );
    discountAmount = appliedCoupon.maxDiscount
      ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
      : rawDiscount;
  }

  const grandTotal = Math.max(0, subtotal + tax + shippingCharges - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput);
      if (success) setCouponInput("");
    }
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container" id="main-content" tabIndex={-1} style={{ padding: "3rem 1.25rem 5rem" }}>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          Shopping Bag
        </h1>
        <p style={{ color: "#64748b", marginBottom: "2.5rem" }}>
          Review your selected items and apply promotional discount codes.
        </p>

        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <FaShoppingBag
              style={{ fontSize: "4rem", color: "#cbd5e1", marginBottom: "1rem" }}
            />
            <h3 style={{ fontSize: "1.4rem", color: "#1e293b", marginBottom: "0.5rem" }}>
              Your shopping bag is completely empty
            </h3>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>
              Explore our tech catalog and add what you love to your bag!
            </p>
            <Link
              to="/search"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "0.85rem 1.8rem",
                borderRadius: "10px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Explore Products <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Left Items Column */}
            <div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "700", color: "#334155" }}>
                    Items ({cart.reduce((tot, i) => tot + i.quantity, 0)})
                  </span>
                  <button
                    onClick={clearCart}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ padding: "0 1.25rem" }}>
                  {cart.map((item) => (
                    <div key={item.productId} className="cart-item-card">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="cart-item-image"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&q=80";
                        }}
                      />

                      <div className="cart-item-details">
                        <Link
                          to={`/product/${item.productId}`}
                          className="cart-item-title"
                        >
                          {item.name}
                        </Link>
                        <span className="cart-item-category">
                          Category: {item.category}
                        </span>
                        <div className="cart-item-price">
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>
                      </div>

                      {/* Controls Row (Quantity + Subtotal + Remove) */}
                      <div className="cart-item-controls">
                        {/* Quantity Stepper */}
                        <div
                          className="quantity-stepper"
                          role="group"
                          aria-label={`Quantity stepper for ${item.name}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            title="Decrease quantity"
                          >
                            <FaMinus size={10} aria-hidden="true" />
                          </button>
                          <span aria-label={`Quantity ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.stock}
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            title="Increase quantity"
                          >
                            <FaPlus size={10} aria-hidden="true" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="cart-item-subtotal">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${item.name} from bag`}
                          title="Remove from cart"
                        >
                          <FaTrash size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue shopping link */}
              <div style={{ marginTop: "1.5rem" }}>
                <Link
                  to="/search"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "#2563eb",
                    fontWeight: "600",
                  }}
                >
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Summary Column */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "2rem",
                position: "sticky",
                top: "90px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  color: "#0f172a",
                }}
              >
                Order Summary
              </h3>

              {/* Coupon Code Section */}
              <div style={{ marginBottom: "1.5rem" }}>
                <form
                  onSubmit={handleApplyCoupon}
                  style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
                  aria-label="Apply discount coupon"
                >
                  <label htmlFor="cart-coupon-input" className="sr-only">
                    Promotional Coupon Code
                  </label>
                  <input
                    id="cart-coupon-input"
                    type="text"
                    aria-label="Enter promotional discount coupon code"
                    placeholder="Enter Coupon (e.g. SUPER50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.65rem 0.85rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      outline: "none",
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Apply entered coupon code"
                    style={{
                      background: "#0f172a",
                      color: "white",
                      border: "none",
                      padding: "0 1.25rem",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Apply
                  </button>
                </form>

                {/* Available Promo Codes Discovery Chips */}
                {coupons && coupons.length > 0 && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "0.35rem" }}>
                      Available Promo Codes (Click to apply):
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          style={{
                            background: appliedCoupon?.code === c.code ? "#dcfce7" : "#f1f5f9",
                            border: `1px solid ${appliedCoupon?.code === c.code ? "#86efac" : "#cbd5e1"}`,
                            color: appliedCoupon?.code === c.code ? "#15803d" : "#334155",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          {c.code} ({c.discountPercent}% OFF)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show applied coupon tag */}
                {appliedCoupon && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                    }}
                  >
                    <FaTag /> {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label={`Remove coupon ${appliedCoupon.code}`}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#15803d",
                        cursor: "pointer",
                      }}
                      title="Remove coupon"
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  fontSize: "0.95rem",
                  color: "#64748b",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Items Subtotal</span>
                  <strong style={{ color: "#1e293b" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Estimated Tax (5% GST)</span>
                  <strong style={{ color: "#1e293b" }}>
                    ₹{tax.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping Fee</span>
                  <span style={{ color: shippingCharges === 0 ? "#16a34a" : "#1e293b", fontWeight: "600" }}>
                    {shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#16a34a",
                      fontWeight: "700",
                    }}
                  >
                    <span>Promo Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "1.25rem 0",
                }}
              >
                <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
                  Grand Total
                </span>
                <span
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "1rem",
                  borderRadius: "10px",
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
                }}
              >
                Proceed to Checkout <FaArrowRight />
              </button>

              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                🔒 Covered by <Link to="/legal?tab=nda" style={{ color: "#2563eb", fontWeight: 600 }}>Commercial NDA</Link> & <Link to="/legal?tab=refund" style={{ color: "#2563eb", fontWeight: 600 }}>30-Day Returns Policy</Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
