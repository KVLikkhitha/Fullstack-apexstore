import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaCreditCard,
  FaQrcode,
  FaMoneyBillWave,
  FaBuilding,
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaFileContract,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import LegalModal from "../../components/store/LegalModal";
import type { ShippingAddress, Order } from "../../types/ecommerceTypes";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, appliedCoupon, placeOrder, currentUserName, openLegalModal, isNdaSigned } =
    useEcommerce();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: currentUserName || "Alex Morgan",
    address: "Flat 402, Skyline Towers, Sector 18",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pinCode: "400001",
    phone: "+91 98201 12345",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<Order["paymentMethod"]>("Card");

  // Simulated card fields
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");

  // Simulated UPI ID
  const [upiId, setUpiId] = useState("alex@okaxis");

  // Legal / NDA Acceptance
  const [agreedToTermsAndNda, setAgreedToTermsAndNda] = useState(isNdaSigned);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="store-wrapper">
        <Navbar />
        <div
          className="store-container"
          style={{ padding: "6rem 1rem", textAlign: "center" }}
        >
          <h2>Your Bag is Empty</h2>
          <p style={{ color: "#64748b", margin: "1rem 0 2rem" }}>
            Add some items to your shopping bag before proceeding to checkout.
          </p>
          <Link
            to="/search"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingCharges = subtotal > 1500 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);

  let discount = 0;
  if (appliedCoupon) {
    const raw = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    discount = appliedCoupon.maxDiscount
      ? Math.min(raw, appliedCoupon.maxDiscount)
      : raw;
  }

  const grandTotal = Math.max(0, subtotal + tax + shippingCharges - discount);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shipping.fullName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.pinCode ||
      !shipping.phone
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (!agreedToTermsAndNda) {
      toast.error("Please accept the Terms of Service & NDA Agreement before confirming your order", {
        icon: "⚠️",
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = placeOrder(shipping, paymentMethod);
      setIsProcessing(false);
      navigate(`/order-success/${newOrder.id}`);
    }, 1200);
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container checkout-page" id="main-content">
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#64748b",
              fontWeight: "600",
              fontSize: "0.9rem",
              marginBottom: "0.75rem",
            }}
          >
            <FaArrowLeft /> Return to Cart
          </Link>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Checkout & Payment
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="checkout-grid" noValidate={false}>
          {/* Left Column: Shipping & Payment Details */}
          <div>
            {/* Step 1: Shipping Address */}
            <div className="checkout-card">
              <h3>1. Delivery Address</h3>

              <div className="form-group">
                <label htmlFor="shipping-fullName">Full Name *</label>
                <input
                  id="shipping-fullName"
                  type="text"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipping-address">Street Address *</label>
                <input
                  id="shipping-address"
                  type="text"
                  name="address"
                  value={shipping.address}
                  onChange={handleInputChange}
                  placeholder="House / Flat No., Apartment, Street"
                  required
                  aria-required="true"
                  autoComplete="street-address"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="shipping-city">City *</label>
                  <input
                    id="shipping-city"
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    autoComplete="address-level2"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="shipping-state">State *</label>
                  <input
                    id="shipping-state"
                    type="text"
                    name="state"
                    value={shipping.state}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="shipping-pinCode">Postal / Pin Code *</label>
                  <input
                    id="shipping-pinCode"
                    type="text"
                    name="pinCode"
                    value={shipping.pinCode}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    autoComplete="postal-code"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="shipping-phone">Contact Phone *</label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="checkout-card">
              <h3>2. Select Payment Method</h3>

              <div className="payment-methods" role="radiogroup" aria-label="Payment method">
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "Card" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("Card")}
                  role="radio"
                  aria-checked={paymentMethod === "Card"}
                >
                  <FaCreditCard size={20} aria-hidden="true" />
                  <div>
                    <div>Credit / Debit Card</div>
                    <small style={{ color: "#64748b" }}>Visa, Mastercard</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "UPI" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("UPI")}
                  role="radio"
                  aria-checked={paymentMethod === "UPI"}
                >
                  <FaQrcode size={20} aria-hidden="true" />
                  <div>
                    <div>Instant UPI</div>
                    <small style={{ color: "#64748b" }}>GPay, PhonePe, Paytm</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "NetBanking" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("NetBanking")}
                  role="radio"
                  aria-checked={paymentMethod === "NetBanking"}
                >
                  <FaBuilding size={20} aria-hidden="true" />
                  <div>
                    <div>Net Banking</div>
                    <small style={{ color: "#64748b" }}>All major banks</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "COD" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                  role="radio"
                  aria-checked={paymentMethod === "COD"}
                >
                  <FaMoneyBillWave size={20} aria-hidden="true" />
                  <div>
                    <div>Cash on Delivery</div>
                    <small style={{ color: "#64748b" }}>Pay at your door</small>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Input Section */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.25rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                }}
              >
                {paymentMethod === "Card" && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="card-number-input">Card Number</label>
                      <input
                        id="card-number-input"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="card-expiry-input">Expiry Date</label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="card-cvv-input">CVV</label>
                        <input
                          id="card-cvv-input"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          autoComplete="cc-csc"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: "#64748b",
                        fontSize: "0.82rem",
                      }}
                    >
                      <FaLock /> 256-bit Encrypted SSL Sandbox Payment
                    </div>
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="upi-id-input">UPI ID (Virtual Payment Address)</label>
                      <input
                        id="upi-id-input"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                      A payment request will be simulated on confirmation.
                    </p>
                  </div>
                )}

                {paymentMethod === "NetBanking" && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="bank-select">Select Bank</label>
                      <select
                        id="bank-select"
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                      >
                        <option>HDFC Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === "COD" && (
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155" }}>
                    💵 Please keep exact cash of ₹{grandTotal.toLocaleString("en-IN")} ready at the time of delivery.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Summary */}
          <div className="order-summary-card">
            <h3>Order Review ({cart.length} items)</h3>

            {/* List mini items */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                marginBottom: "1.25rem",
                paddingRight: "0.5rem",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80";
                    }}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1, fontSize: "0.85rem" }}>
                    <strong style={{ display: "block", color: "#0f172a" }}>
                      {item.name}
                    </strong>
                    <span style={{ color: "#64748b" }}>
                      Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="summary-line">
              <span>Items Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-line">
              <span>GST Tax (5%)</span>
              <strong>₹{tax.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-line">
              <span>Shipping Charge</span>
              <span>{shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}</span>
            </div>

            {discount > 0 && (
              <div className="summary-line discount">
                <span>Promo Discount ({appliedCoupon?.code})</span>
                <span>-₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="summary-line total">
              <span>Total Payable</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Terms and NDA Agreement Checkbox */}
            <div
              style={{
                margin: "1.25rem 0",
                padding: "0.9rem",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: "#334155",
                  lineHeight: "1.4",
                }}
              >
                <input
                  type="checkbox"
                  id="checkout-terms-nda-agreement"
                  checked={agreedToTermsAndNda}
                  onChange={(e) => setAgreedToTermsAndNda(e.target.checked)}
                  style={{ marginTop: "3px", accentColor: "#2563eb", width: "16px", height: "16px" }}
                  required
                  aria-required="true"
                />
                <span>
                  I have read and agree to the{" "}
                  <strong>Terms of Service</strong>,{" "}
                  <strong>Privacy Policy</strong>, and{" "}
                  <strong>Mutual Non-Disclosure Agreement (NDA)</strong>.
                </span>
              </label>

              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.8rem", paddingLeft: "1.6rem" }}>
                <button
                  type="button"
                  onClick={() => openLegalModal("nda")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: 0,
                  }}
                >
                  <FaFileContract /> Review NDA & Terms
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="place-order-btn"
              aria-label={`Confirm and place order for total ₹${grandTotal.toLocaleString("en-IN")}`}
            >
              {isProcessing
                ? "Processing Secure Order..."
                : `Confirm & Place Order (₹${grandTotal.toLocaleString("en-IN")})`}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                marginTop: "1rem",
                color: "#64748b",
                fontSize: "0.82rem",
              }}
            >
              <FaShieldAlt style={{ color: "#16a34a" }} /> 100% Purchase Protection & Confidentiality
            </div>
          </div>
        </form>
      </main>

      <LegalModal />
      <Footer />
    </div>
  );
};

export default Checkout;
