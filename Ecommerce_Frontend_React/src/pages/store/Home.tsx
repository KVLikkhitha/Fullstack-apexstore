import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiMacbookLine,
  RiHeadphoneLine,
  RiCameraLensLine,
  RiFootprintLine,
  RiTimeLine,
  RiSmartphoneLine,
  RiArrowRightLine,
  RiFireLine,
  RiCoupon3Fill,
  RiGamepadLine,
} from "react-icons/ri";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import ProductCard from "../../components/store/ProductCard";
import CartDrawer from "../../components/store/CartDrawer";

const categories = [
  { name: "Laptops", icon: <RiMacbookLine />, count: "Premium Silicon" },
  { name: "Footwear", icon: <RiFootprintLine />, count: "Performance & Casual" },
  { name: "Audio", icon: <RiHeadphoneLine />, count: "Hi-Res & ANC" },
  { name: "Wearables", icon: <RiTimeLine />, count: "Smart Health" },
  { name: "Cameras", icon: <RiCameraLensLine />, count: "4K Mirrorless" },
  { name: "Mobile Phones", icon: <RiSmartphoneLine />, count: "Flagship 5G" },
];

const Home = () => {
  const { products } = useEcommerce();
  const navigate = useNavigate();

  // Flash deal countdown timer (e.g. 05:42:19)
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const latestProducts = products.slice(0, 8);

  return (
    <div className="store-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="store-hero">
        <div className="store-container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">
                <RiFireLine /> Premium Hardware & Lifestyle
              </div>
              <h1>
                Elevate Your Everyday <br />
                <span className="gradient-text">With Pure Performance</span>
              </h1>
              <p>
                Explore handpicked next-gen gear, ultra-responsive computing,
                high-fidelity noise-cancelling audio, and athletic precision wear.
              </p>
              <div className="hero-buttons">
                <Link to="/search" className="btn-primary">
                  Explore Catalog <RiArrowRightLine />
                </Link>
                <Link to="/admin/dashboard" className="btn-secondary">
                  Open Admin Suite &rarr;
                </Link>
              </div>
            </div>

            {/* Featured Showcase Card */}
            {products[1] && (
              <div className="hero-featured-card">
                <span className="badge-deal">Featured Deal</span>
                <img
                  src={products[1].photo}
                  alt={products[1].name}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80";
                  }}
                />
                <h3>{products[1].name}</h3>
                <div className="pricing">
                  <span className="current">
                    ₹{products[1].price.toLocaleString("en-IN")}
                  </span>
                  {products[1].originalPrice && (
                    <span className="original">
                      ₹{products[1].originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <Link
                  to={`/product/${products[1].id}`}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="store-container" id="main-content">
        {/* Category Exploration Section */}
        <section style={{ marginBottom: "4rem" }}>
          <div className="section-title-wrap">
            <div>
              <h2>Shop by Category</h2>
              <p>Find the exact hardware or gear you're searching for</p>
            </div>
            <Link to="/search" className="see-all-link">
              Browse All Categories <RiArrowRightLine />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/search?category=${cat.name}`)}
              >
                <div className="cat-icon-wrap">{cat.icon}</div>
                <h4>{cat.name}</h4>
                <span>{cat.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Deals / Gamified Toss Promotion Banner */}
        <section className="flash-deals-banner">
          <div className="deal-info">
            <span className="badge">Limited-Time Flash Event</span>
            <h2>Get 15% Extra OFF with Coin Toss!</h2>
            <p>
              Need a quick discount? Play our interactive 3D Coin Flip game or
              apply the generated promo code <strong>LUCKY15</strong> at checkout.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                to="/admin/app/toss"
                style={{
                  background: "#ffffff",
                  color: "#1e1b4b",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "10px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <RiGamepadLine /> Play Coin Toss App
              </Link>
              <Link
                to="/admin/app/coupon"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#ffffff",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "10px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <RiCoupon3Fill /> Create Custom Coupon
              </Link>
            </div>
          </div>

          <div className="interactive-deal-action">
            <span style={{ fontSize: "0.9rem", color: "#e2e8f0" }}>
              Deal Closes In:
            </span>
            <div className="timer-pill">
              <div className="time-box">
                <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                <span>Hours</span>
              </div>
              <div className="time-box">
                <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                <span>Mins</span>
              </div>
              <div className="time-box">
                <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                <span>Secs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section style={{ marginBottom: "4rem" }}>
          <div className="section-title-wrap">
            <div>
              <h2>Featured Best-Sellers</h2>
              <p>Top-rated by customers this week</p>
            </div>
            <Link to="/search" className="see-all-link">
              View All <RiArrowRightLine />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* All / Latest Arrivals Section */}
        <section style={{ marginBottom: "4rem" }}>
          <div className="section-title-wrap">
            <div>
              <h2>Latest Arrivals</h2>
              <p>Fresh stock added directly to our inventory</p>
            </div>
            <Link to="/search" className="see-all-link">
              Search Catalog <RiArrowRightLine />
            </Link>
          </div>

          <div className="products-grid">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      <Footer />
    </div>
  );
};

export default Home;
