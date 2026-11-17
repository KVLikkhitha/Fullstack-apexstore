import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaBolt,
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaShareAlt,
  FaFire,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import ProductCard from "../../components/store/ProductCard";
import CartDrawer from "../../components/store/CartDrawer";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    currentUserName,
    toggleCartDrawer,
  } = useEcommerce();

  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState<number>(1);

  // Review submission state
  const [reviewerName, setReviewerName] = useState<string>(currentUserName || "");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  if (!product) {
    return (
      <div className="store-wrapper">
        <Navbar />
        <div
          className="store-container"
          style={{ padding: "6rem 1rem", textAlign: "center" }}
        >
          <h2>Product Not Found</h2>
          <p style={{ color: "#64748b", margin: "1rem 0 2rem" }}>
            The product you requested does not exist or has been removed.
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
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toggleCartDrawer(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard! 🔗");
    } else {
      toast("Link: " + window.location.href, { icon: "🔗" });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please provide review text");
      return;
    }
    addReview({
      productId: product.id,
      userName: reviewerName.trim() || "Anonymous Buyer",
      rating,
      comment: comment.trim(),
    });
    setComment("");
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container product-details-page" id="main-content" tabIndex={-1}>
        {/* Back Link */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            to="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#64748b",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            <FaArrowLeft /> Back to Products
          </Link>
        </div>

        {/* Product Details Main Grid */}
        <div className="details-grid">
          {/* Main Photo Gallery */}
          <div className="product-gallery">
            <img
              src={product.photo}
              alt={product.name}
              className="main-image"
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
              }}
            />
          </div>

          {/* Product Info & Actions */}
          <div className="product-content">
            <span className="badge-category">{product.category}</span>
            <h1>{product.name}</h1>

            {/* Ratings Bar */}
            <div className="rating-row">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    style={{
                      color: star <= Math.round(product.rating) ? "#f59e0b" : "#cbd5e1",
                    }}
                  />
                ))}
              </div>
              <span className="rating-score">{product.rating.toFixed(1)} / 5</span>
              <span className="review-link">
                ({product.reviewCount} customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="price-box">
              <span className="price-now">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="price-was">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent && (
                <span className="discount-chip">{discountPercent}% OFF</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {/* Stock status urgency indicator */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                background:
                  product.stock === 0
                    ? "#fef2f2"
                    : product.stock <= 5
                    ? "#fff7ed"
                    : "#f0fdf4",
                border: `1px solid ${
                  product.stock === 0
                    ? "#fecaca"
                    : product.stock <= 5
                    ? "#ffedd5"
                    : "#bbf7d0"
                }`,
                color:
                  product.stock === 0
                    ? "#dc2626"
                    : product.stock <= 5
                    ? "#c2410c"
                    : "#15803d",
                fontWeight: "700",
                fontSize: "0.88rem",
              }}
            >
              {product.stock === 0 ? (
                <span>Out of Stock</span>
              ) : product.stock <= 5 ? (
                <>
                  <FaFire style={{ color: "#ea580c" }} />
                  <span>High Demand: Only {product.stock} units left in stock!</span>
                </>
              ) : (
                <>
                  <FaCheckCircle style={{ color: "#16a34a" }} />
                  <span>In Stock ({product.stock} units available)</span>
                </>
              )}
            </div>

            {/* Actions: Quantity + Add To Cart + Buy Now + Wishlist + Share */}
            {product.stock > 0 && (
              <div className="action-row">
                <div className="quantity-selector" role="group" aria-label="Product quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                  >
                    <FaMinus size={12} aria-hidden="true" />
                  </button>
                  <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.min(product.stock, prev + 1))
                    }
                    aria-label="Increase quantity"
                    title="Increase quantity"
                  >
                    <FaPlus size={12} aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-add-cart"
                  onClick={handleAddToCart}
                  aria-label={`Add ${quantity} ${product.name} to cart`}
                >
                  <FaShoppingCart aria-hidden="true" /> Add to Cart
                </button>

                <button
                  type="button"
                  className="btn-add-cart"
                  style={{ background: "#0f172a" }}
                  onClick={handleBuyNow}
                  aria-label={`Buy ${product.name} immediately`}
                >
                  <FaBolt aria-hidden="true" /> Buy Now
                </button>

                <button
                  type="button"
                  className={`btn-wishlist-toggle ${isWishlisted ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  aria-pressed={isWishlisted}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
                </button>

                <button
                  type="button"
                  className="btn-wishlist-toggle"
                  onClick={handleShare}
                  title="Share product link"
                  aria-label="Share product link"
                  style={{ background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1" }}
                >
                  <FaShareAlt aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Technical Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="specs-list">
                <h4>Product Highlights & Specifications</h4>
                <ul>
                  {product.specs.map((spec) => (
                    <li key={spec.label}>
                      <strong>{spec.label}:</strong> {spec.value}
                    </li>
                  ))}
                  <li>
                    <strong>Brand:</strong> {product.brand || "Apex Certified"}
                  </li>
                  <li>
                    <strong>SKU Code:</strong> {product.id}
                  </li>
                </ul>
              </div>
            )}

            {/* Trust, Warranty & NDA Protection Banner */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "#f0fdf4",
                borderRadius: "10px",
                border: "1px solid #bbf7d0",
                fontSize: "0.85rem",
                color: "#166534",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaShieldAlt style={{ fontSize: "1.2rem", color: "#16a34a" }} aria-hidden="true" />
                <span>
                  <strong>ApexStore Protection:</strong> 1-Year Warranty &bull; 30-Day Returns &bull; Commercial NDA Safeguards
                </span>
              </div>
              <Link
                to="/legal?tab=nda"
                style={{
                  color: "#15803d",
                  fontWeight: "700",
                  textDecoration: "underline",
                  fontSize: "0.8rem",
                }}
              >
                Inspect NDA Details &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <section className="reviews-section">
          <h3>Customer Reviews & Ratings</h3>

          {/* Write a review form */}
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h4>Leave a Verified Review</h4>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Your Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Average)</option>
                <option value={2}>⭐⭐ (2 - Below Expectation)</option>
                <option value={1}>⭐ (1 - Disappointed)</option>
              </select>
            </div>
            <textarea
              placeholder="Share details about fit, build quality, usability, or performance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
          </form>

          {/* Existing reviews list */}
          <div className="reviews-list">
            {productReviews.length === 0 ? (
              <p style={{ color: "#64748b", margin: 0 }}>
                No reviews yet for this product. Be the first to share your experience!
              </p>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <div>
                      <strong>{rev.userName}</strong>
                      <div
                        style={{
                          display: "inline-flex",
                          marginLeft: "0.75rem",
                          color: "#f59e0b",
                          fontSize: "0.8rem",
                          gap: "2px",
                        }}
                      >
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                    <span>{rev.date}</span>
                  </div>
                  <p>{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: "4rem" }}>
            <div className="section-title-wrap">
              <div>
                <h2>Related in {product.category}</h2>
                <p>Other items you might be interested in</p>
              </div>
            </div>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default ProductDetails;
