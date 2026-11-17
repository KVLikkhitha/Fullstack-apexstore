import { Link } from "react-router-dom";
import {
  RiShoppingBag3Fill,
  RiShieldCheckLine,
  RiTruckLine,
  RiCustomerService2Line,
  RiRefund2Line,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        paddingTop: "4rem",
        borderTop: "1px solid #1e293b",
        marginTop: "auto",
      }}
    >
      <div className="store-container">
        {/* Value Propositions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid #1e293b",
            marginBottom: "3rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(37, 99, 235, 0.15)",
                color: "#60a5fa",
                display: "grid",
                placeItems: "center",
                fontSize: "1.5rem",
              }}
            >
              <RiTruckLine />
            </div>
            <div>
              <h4 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                Free Fast Delivery
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                On all orders over ₹1,500
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                display: "grid",
                placeItems: "center",
                fontSize: "1.5rem",
              }}
            >
              <RiShieldCheckLine />
            </div>
            <div>
              <h4 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                100% Genuine Brands
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Verified warranties & receipts
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#fbbf24",
                display: "grid",
                placeItems: "center",
                fontSize: "1.5rem",
              }}
            >
              <RiRefund2Line />
            </div>
            <div>
              <h4 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                30-Day Hassle-Free
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Instant returns & exchanges
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(168, 85, 247, 0.15)",
                color: "#c084fc",
                display: "grid",
                placeItems: "center",
                fontSize: "1.5rem",
              }}
            >
              <RiCustomerService2Line />
            </div>
            <div>
              <h4 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                24/7 Expert Support
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Dedicated specialist team
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            paddingBottom: "3rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#ffffff",
                fontSize: "1.3rem",
                fontWeight: "800",
                marginBottom: "1rem",
              }}
            >
              <RiShoppingBag3Fill style={{ color: "#3b82f6" }} />
              <span>ApexStore</span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              Next-generation e-commerce platform bringing you top-tier electronics,
              wearables, computing gear, and athletic apparel.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Catalog</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
              <li><Link to="/search?category=Laptops" style={{ color: "#94a3b8" }}>Laptops & Tech</Link></li>
              <li><Link to="/search?category=Footwear" style={{ color: "#94a3b8" }}>Athletic Footwear</Link></li>
              <li><Link to="/search?category=Audio" style={{ color: "#94a3b8" }}>Noise-Cancelling Audio</Link></li>
              <li><Link to="/search?category=Wearables" style={{ color: "#94a3b8" }}>Smart Wearables</Link></li>
              <li><Link to="/search?category=Cameras" style={{ color: "#94a3b8" }}>Mirrorless Cameras</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Customer Care</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
              <li><Link to="/orders" style={{ color: "#94a3b8" }}>Track My Order</Link></li>
              <li><Link to="/cart" style={{ color: "#94a3b8" }}>Shopping Cart</Link></li>
              <li><Link to="/wishlist" style={{ color: "#94a3b8" }}>Saved Wishlist</Link></li>
              <li><Link to="/admin/app/coupon" style={{ color: "#94a3b8" }}>Generate Promo Coupons</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: "1rem" }}>Admin Suite</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
              <li><Link to="/admin/dashboard" style={{ color: "#94a3b8" }}>Sales Dashboard</Link></li>
              <li><Link to="/admin/product" style={{ color: "#94a3b8" }}>Manage Products</Link></li>
              <li><Link to="/admin/transaction" style={{ color: "#94a3b8" }}>Fulfill Orders</Link></li>
              <li><Link to="/admin/customer" style={{ color: "#94a3b8" }}>Customer Directory</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            padding: "1.5rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <span>&copy; {new Date().getFullYear()} ApexStore Inc. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link to="/legal?tab=nda" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Mutual NDA
            </Link>
            <Link to="/legal?tab=terms" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Terms of Service
            </Link>
            <Link to="/legal?tab=privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Privacy & DPDP
            </Link>
            <Link to="/legal?tab=refund" style={{ color: "#94a3b8", textDecoration: "none" }}>
              30-Day Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
