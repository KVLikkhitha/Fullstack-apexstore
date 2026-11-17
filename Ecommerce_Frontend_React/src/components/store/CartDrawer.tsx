import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80";

const CartDrawer = () => {
  const {
    cart,
    isCartDrawerOpen,
    toggleCartDrawer,
    updateCartQuantity,
    removeFromCart,
  } = useEcommerce();

  const navigate = useNavigate();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        toggleCartDrawer(false);
      }
    };
    if (isCartDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartDrawerOpen, toggleCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const totalCartCount = cart.reduce((total, i) => total + i.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 1500;
  const freeShippingEligible = subtotal >= freeShippingThreshold;

  const handleCheckoutClick = () => {
    toggleCartDrawer(false);
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    toggleCartDrawer(false);
    navigate("/cart");
  };

  return (
    <div
      className="cart-drawer-overlay"
      onClick={() => toggleCartDrawer(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <h2 id="cart-drawer-title" style={{ fontSize: "1.15rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaShoppingBag aria-hidden="true" /> Shopping Bag ({totalCartCount})
          </h2>
          <button
            className="close-drawer-btn"
            onClick={() => toggleCartDrawer(false)}
            aria-label="Close shopping bag drawer"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: freeShippingEligible ? "#f0fdf4" : "#eff6ff",
            borderBottom: "1px solid #e2e8f0",
            fontSize: "0.85rem",
            color: freeShippingEligible ? "#15803d" : "#1e40af",
            fontWeight: "600",
          }}
          aria-live="polite"
        >
          {freeShippingEligible
            ? "🎉 You have unlocked Free Standard Shipping!"
            : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString(
                "en-IN"
              )} more to get FREE shipping!`}
        </div>

        {/* Drawer Body Items */}
        <div className="drawer-body" role="region" aria-label="Items in bag">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <FaShoppingBag className="empty-icon" aria-hidden="true" />
              <h4>Your bag is empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button
                className="shop-now-btn"
                onClick={() => {
                  toggleCartDrawer(false);
                  navigate("/search");
                }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="drawer-item">
                <img
                  src={item.photo}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                  <div className="quantity-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
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
                    <span aria-label={`Current quantity: ${item.quantity}`}>{item.quantity}</span>
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
                </div>
                <button
                  type="button"
                  className="delete-item-btn"
                  onClick={() => removeFromCart(item.productId)}
                  aria-label={`Remove ${item.name} from bag`}
                  title="Remove from cart"
                >
                  <FaTrash aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>
            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span>{freeShippingEligible ? "FREE" : "₹150"}</span>
            </div>
            <div className="summary-row total">
              <span>Estimated Total</span>
              <span>
                ₹
                {(
                  subtotal + (freeShippingEligible ? 0 : 150)
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckoutClick}
              aria-label="Proceed to checkout page"
            >
              Proceed to Checkout &rarr;
            </button>
            <button
              onClick={handleViewCartClick}
              className="view-cart-link"
              style={{ background: "none", border: "none", width: "100%", cursor: "pointer" }}
              aria-label="View shopping bag page"
            >
              View Full Bag Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
