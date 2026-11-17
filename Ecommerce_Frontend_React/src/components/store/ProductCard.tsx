import { Link } from "react-router-dom";
import { FaStar, FaRegHeart, FaHeart, FaPlus } from "react-icons/fa";
import type { Product } from "../../types/ecommerceTypes";
import { useEcommerce } from "../../context/EcommerceContext";

interface ProductCardProps {
  product: Product;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80";

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, wishlist, toggleWishlist } = useEcommerce();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : null;

  return (
    <article className="product-card" aria-label={`Product card: ${product.name}`}>
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`} aria-label={`View details for ${product.name}`}>
          <img
            src={product.photo}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
          />
        </Link>

        {/* Wishlist toggle */}
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
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

        {/* Discount badge */}
        {discountPercent && (
          <span className="discount-badge" aria-label={`${discountPercent}% discount`}>
            -{discountPercent}%
          </span>
        )}

        {/* Quick Add Button */}
        {product.stock > 0 && (
          <button
            type="button"
            className="quick-add-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            aria-label={`Add ${product.name} to shopping cart`}
          >
            <FaPlus size={12} aria-hidden="true" /> Add to Cart
          </button>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title">
          {product.name}
        </Link>

        {/* Rating */}
        <div
          className="product-rating"
          aria-label={`Rating: ${product.rating.toFixed(1)} out of 5 stars based on ${product.reviewCount} reviews`}
        >
          <FaStar aria-hidden="true" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="reviews-count">({product.reviewCount})</span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="original-price" aria-label={`Original price: ₹${product.originalPrice.toLocaleString("en-IN")}`}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}

          <span
            className={`stock-tag ${
              product.stock <= 0 ? "out" : product.stock < 5 ? "low" : ""
            }`}
          >
            {product.stock <= 0
              ? "Out of stock"
              : product.stock < 5
              ? `Only ${product.stock} left`
              : "In stock"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
