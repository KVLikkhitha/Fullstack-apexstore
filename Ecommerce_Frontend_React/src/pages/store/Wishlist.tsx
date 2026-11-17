import { Link } from "react-router-dom";
import { FaHeart, FaArrowRight } from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import ProductCard from "../../components/store/ProductCard";
import CartDrawer from "../../components/store/CartDrawer";

const Wishlist = () => {
  const { wishlist, products } = useEcommerce();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container" id="main-content" tabIndex={-1} style={{ padding: "3rem 1.25rem 5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <FaHeart style={{ color: "#ef4444" }} /> Saved Wishlist
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Keep track of items you plan to purchase or save for later.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <FaHeart
              style={{ fontSize: "3.5rem", color: "#fca5a5", marginBottom: "1rem" }}
            />
            <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "0.5rem" }}>
              Your wishlist is empty
            </h3>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              Explore products and tap the heart icon on any card to save it here!
            </p>
            <Link
              to="/search"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
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
          <div className="products-grid">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default Wishlist;
