import { useParams, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaTruck,
  FaArrowRight,
  FaFileInvoice,
  FaClock,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useEcommerce();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="store-wrapper">
        <Navbar />
        <div
          className="store-container"
          style={{ padding: "6rem 1rem", textAlign: "center" }}
        >
          <h2>Order Not Found</h2>
          <p style={{ color: "#64748b", margin: "1rem 0 2rem" }}>
            The requested order could not be located.
          </p>
          <Link
            to="/orders"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Go to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="store-wrapper">
      <Navbar />

      <main
        className="store-container"
        id="main-content"
        tabIndex={-1}
        style={{ padding: "3.5rem 1.25rem 5rem", maxWidth: "800px" }}
      >
        {/* Celebration Banner */}
        <div
          style={{
            textAlign: "center",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "3rem 2rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#16a34a",
              fontSize: "3rem",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <FaCheckCircle />
          </div>

          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "0.5rem",
            }}
          >
            Order Placed Successfully!
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "#64748b",
              maxWidth: "520px",
              margin: "0 auto 1.5rem",
              lineHeight: "1.6",
            }}
          >
            Thank you for shopping with ApexStore. Your order has been registered
            and our warehouse fulfillment team has been notified.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              color: "#1d4ed8",
              fontWeight: "700",
              fontFamily: "monospace",
              fontSize: "1rem",
            }}
          >
            <FaFileInvoice /> Order Reference: {order.id}
          </div>
        </div>

        {/* Order Details Receipt */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaBoxOpen /> Shipment & Receipt Summary
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <span style={{ fontSize: "0.82rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
                Delivery To
              </span>
              <div style={{ fontWeight: "700", color: "#0f172a", marginTop: "0.25rem" }}>
                {order.shippingAddress.fullName}
              </div>
              <div style={{ fontSize: "0.88rem", color: "#475569" }}>
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </div>
              <div style={{ fontSize: "0.88rem", color: "#475569" }}>
                {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </div>
              <div style={{ fontSize: "0.88rem", color: "#475569" }}>
                Phone: {order.shippingAddress.phone}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.82rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
                Estimated Delivery Date
              </span>
              <div
                style={{
                  fontWeight: "700",
                  color: "#0f172a",
                  marginTop: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <FaTruck style={{ color: "#2563eb" }} /> {order.estimatedDelivery}
              </div>
              <div style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "0.5rem" }}>
                Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
              </div>
              <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Status: <strong style={{ color: "#2563eb" }}>{order.status}</strong>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700", display: "block", marginBottom: "0.75rem" }}>
              Ordered Products ({order.orderItems.length})
            </span>
            {order.orderItems.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <img
                  src={item.photo}
                  alt={item.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>
                    {item.name}
                  </strong>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Quantity: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <strong style={{ color: "#0f172a" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1px dashed #cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
              Total Paid
            </span>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#16a34a" }}>
              ₹{order.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            to="/orders"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "0.85rem 1.6rem",
              borderRadius: "10px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <FaClock /> View In Order Tracker
          </Link>

          <Link
            to={`/admin/transaction/${order.id}`}
            style={{
              background: "#0f172a",
              color: "white",
              padding: "0.85rem 1.6rem",
              borderRadius: "10px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <FaTruck /> Admin Suite: Fulfill Order &rarr;
          </Link>

          <Link
            to="/search"
            style={{
              background: "#f1f5f9",
              color: "#334155",
              padding: "0.85rem 1.6rem",
              borderRadius: "10px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            Continue Shopping <FaArrowRight />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
