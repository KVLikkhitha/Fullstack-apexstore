import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaShoppingBag,
  FaExternalLinkAlt,
  FaFileInvoice,
  FaPrint,
  FaTimes,
  FaUndo,
  FaBan,
  FaRoute,
  FaCalendarAlt,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import type { Order } from "../../types/ecommerceTypes";

const fallbackImage =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80";

const OrderHistory = () => {
  const {
    orders,
    currentUserRole,
    currentUserName,
    currentUserEmail,
    cancelOrder,
  } = useEcommerce();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [selectedTracking, setSelectedTracking] = useState<Order | null>(null);

  // RBAC Data Isolation: Customers only see their own orders; Admins can see all orders
  const displayedOrders =
    currentUserRole === "Admin"
      ? orders
      : orders.filter((order) => {
          const matchesEmail =
            order.userEmail &&
            currentUserEmail &&
            order.userEmail.toLowerCase() === currentUserEmail.toLowerCase();
          const matchesName =
            order.user &&
            currentUserName &&
            order.user.toLowerCase() === currentUserName.toLowerCase();
          const matchesAddressName =
            order.shippingAddress?.fullName &&
            currentUserName &&
            order.shippingAddress.fullName.toLowerCase() ===
              currentUserName.toLowerCase();
          return matchesEmail || matchesName || matchesAddressName;
        });

  const getStepStatus = (
    orderStatus: string,
    step: "Placed" | "Processing" | "Shipped" | "Delivered"
  ) => {
    if (step === "Placed") return "completed";
    if (orderStatus === "Delivered") return "completed";
    if (orderStatus === "Shipped") {
      if (step === "Processing" || step === "Shipped") return "completed";
      return "pending";
    }
    if (orderStatus === "Processing") {
      if (step === "Processing") return "active";
      return "pending";
    }
    return "pending";
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container" id="main-content" style={{ padding: "3rem 1.25rem 5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "0.5rem",
                }}
              >
                My Orders & Live Fulfillment
              </h1>
              <p style={{ color: "#64748b", margin: 0 }}>
                Track real-time courier fulfillment progress, inspect itemized tax invoices, and initiate 30-day RMA replacements.
              </p>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                background: currentUserRole === "Admin" ? "#eff6ff" : "#f0fdf4",
                border: `1px solid ${
                  currentUserRole === "Admin" ? "#bfdbfe" : "#bbf7d0"
                }`,
                fontSize: "0.85rem",
                fontWeight: "600",
                color: currentUserRole === "Admin" ? "#1e40af" : "#166534",
              }}
            >
              <span>
                {currentUserRole === "Admin"
                  ? "🛡️ Admin Account (Viewing All Orders)"
                  : `👤 Customer: ${currentUserName} (${displayedOrders.length} order${
                      displayedOrders.length === 1 ? "" : "s"
                    })`}
              </span>
            </div>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
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
              style={{ fontSize: "3.5rem", color: "#cbd5e1", marginBottom: "1rem" }}
              aria-hidden="true"
            />
            <h2 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "0.5rem" }}>
              No orders found
            </h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              {currentUserRole === "Customer"
                ? `No orders placed yet under account ${currentUserName} (${currentUserEmail}).`
                : "No customer orders recorded in the system yet."}
            </p>
            <Link
              to="/search"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                display: "inline-block",
              }}
              aria-label="Start shopping catalog"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {displayedOrders.map((order) => (
              <article key={order.id} className="order-tracking-card" aria-label={`Order ${order.id}`}>
                {/* Header */}
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                    <div className="order-date">
                      Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ display: "block", fontSize: "1.1rem", color: "#0f172a" }}>
                        ₹{order.total.toLocaleString("en-IN")}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          color: order.paymentStatus === "Paid" ? "#16a34a" : "#ea580c",
                        }}
                      >
                        {order.paymentMethod} &bull; {order.paymentStatus}
                      </span>
                    </div>

                    {/* Track Shipment Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTracking(order)}
                      style={{
                        fontSize: "0.82rem",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "6px",
                        background: "#f0fdf4",
                        color: "#166534",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        border: "1px solid #bbf7d0",
                        cursor: "pointer",
                      }}
                      aria-label={`Track delivery for order ${order.id}`}
                    >
                      <FaRoute /> Track
                    </button>

                    {/* View Tax Invoice Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(order)}
                      style={{
                        fontSize: "0.82rem",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "6px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        border: "1px solid #bfdbfe",
                        cursor: "pointer",
                      }}
                      aria-label={`View tax invoice for order ${order.id}`}
                    >
                      <FaFileInvoice /> Invoice
                    </button>

                    {/* Customer Cancel Order Action (Active for Processing Orders) */}
                    {order.status === "Processing" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to cancel Order #${order.id}? The purchased items will be returned to inventory stock.`
                            )
                          ) {
                            cancelOrder(order.id);
                          }
                        }}
                        style={{
                          fontSize: "0.82rem",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "6px",
                          background: "#fef2f2",
                          color: "#b91c1c",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          border: "1px solid #fecaca",
                          cursor: "pointer",
                        }}
                        aria-label={`Cancel order ${order.id}`}
                      >
                        <FaBan /> Cancel
                      </button>
                    )}

                    {/* Quick Admin Fulfill Link */}
                    <Link
                      to={`/admin/transaction/${order.id}`}
                      style={{
                        fontSize: "0.82rem",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "6px",
                        background: "#f1f5f9",
                        color: "#334155",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        border: "1px solid #cbd5e1",
                      }}
                      title="Manage / Update status in Admin Suite"
                      aria-label={`Manage order ${order.id} in admin suite`}
                    >
                      Admin Manage <FaExternalLinkAlt size={10} />
                    </Link>
                  </div>
                </div>

                {/* Status Timeline or Cancelled Alert */}
                {order.status === "Cancelled" ? (
                  <div
                    style={{
                      padding: "0.85rem 1.25rem",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "12px",
                      color: "#b91c1c",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <FaBan style={{ fontSize: "1.1rem" }} />
                    <span>
                      Order Cancelled — Reserved inventory has been restored and refund processed to your original payment method ({order.paymentMethod}).
                    </span>
                  </div>
                ) : (
                  <div className="timeline" role="progressbar" aria-label={`Fulfillment status: ${order.status}`}>
                    <div className={`timeline-step ${getStepStatus(order.status, "Placed")}`}>
                      <div className="step-icon">
                        <FaCheck aria-hidden="true" />
                      </div>
                      <span>Order Placed</span>
                    </div>

                    <div className={`timeline-step ${getStepStatus(order.status, "Processing")}`}>
                      <div className="step-icon">
                        <FaBox aria-hidden="true" />
                      </div>
                      <span>Processing</span>
                    </div>

                    <div className={`timeline-step ${getStepStatus(order.status, "Shipped")}`}>
                      <div className="step-icon">
                        <FaTruck aria-hidden="true" />
                      </div>
                      <span>Shipped</span>
                    </div>

                    <div className={`timeline-step ${getStepStatus(order.status, "Delivered")}`}>
                      <div className="step-icon">
                        <FaCheckCircle aria-hidden="true" />
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}

                {/* Items in this order */}
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#475569",
                    }}
                  >
                    <span>Items ({order.orderItems.length})</span>
                    <span>
                      Est. Delivery: <strong>{order.estimatedDelivery}</strong>
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {order.orderItems.map((item) => (
                      <div
                        key={item.productId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <img
                          src={item.photo}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImage;
                          }}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ flex: 1, fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600", color: "#1e293b" }}>
                            {item.name}
                          </span>
                          <span style={{ color: "#64748b", marginLeft: "0.5rem" }}>
                            &times; {item.quantity}
                          </span>
                        </div>
                        <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      Delivering to: {order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.pinCode})
                    </span>
                    <Link
                      to="/legal?tab=refund"
                      style={{
                        fontSize: "0.8rem",
                        color: "#2563eb",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontWeight: 600,
                      }}
                    >
                      <FaUndo /> 30-Day Return / RMA Policy
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Tax Invoice Modal */}
      {selectedInvoice && (
        <div
          className="legal-modal-overlay"
          onClick={() => setSelectedInvoice(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="invoice-modal-title"
        >
          <div
            className="legal-modal-container"
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="legal-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaFileInvoice style={{ color: "#2563eb", fontSize: "1.2rem" }} />
                <h3 id="invoice-modal-title" style={{ margin: 0 }}>
                  Tax Invoice / Official Receipt #{selectedInvoice.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="legal-modal-close"
                aria-label="Close invoice dialog"
              >
                <FaTimes />
              </button>
            </div>

            <div className="legal-modal-body" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.25rem", color: "#0f172a" }}>ApexStore Inc.</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                    GSTIN: 27AABCA1234F1Z5 | CIN: U74999MH2026PTC<br />
                    Fulfillment Hub: Sector 18, MIDC, Mumbai, Maharashtra
                  </p>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#64748b" }}>
                  <div><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</div>
                  <div><strong>Payment:</strong> {selectedInvoice.paymentMethod} ({selectedInvoice.paymentStatus})</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem", fontSize: "0.85rem" }}>
                <strong style={{ color: "#0f172a" }}>Bill To & Ship To:</strong>
                <div>{selectedInvoice.shippingAddress.fullName}</div>
                <div>{selectedInvoice.shippingAddress.address}</div>
                <div>{selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.state} - {selectedInvoice.shippingAddress.pinCode}</div>
                <div>Phone: {selectedInvoice.shippingAddress.phone}</div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", marginBottom: "1rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #cbd5e1" }}>
                    <th style={{ padding: "0.5rem" }}>Item Description</th>
                    <th style={{ padding: "0.5rem", textAlign: "center" }}>Qty</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Unit Price</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.orderItems.map((item) => (
                    <tr key={item.productId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.5rem" }}>{item.name}</td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ padding: "0.5rem", textAlign: "right" }}>₹{item.price.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "0.5rem", textAlign: "right" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ width: "240px", marginLeft: "auto", display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.88rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <strong>₹{selectedInvoice.subtotal.toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>GST (5%):</span>
                  <span>₹{selectedInvoice.tax.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping:</span>
                  <span>{selectedInvoice.shippingCharges === 0 ? "FREE" : `₹${selectedInvoice.shippingCharges}`}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                    <span>Discount:</span>
                    <span>-₹{selectedInvoice.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #cbd5e1", paddingTop: "0.5rem", fontWeight: "800", fontSize: "1rem" }}>
                  <span>Total Paid:</span>
                  <span>₹{selectedInvoice.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="legal-modal-footer">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-sign-submit"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <FaPrint /> Print Official Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="btn-modal-done"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Courier Tracking Modal */}
      {selectedTracking && (
        <div
          className="legal-modal-overlay"
          onClick={() => setSelectedTracking(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracking-modal-title"
        >
          <div
            className="legal-modal-container"
            style={{ maxWidth: "640px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="legal-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <FaRoute style={{ color: "#16a34a", fontSize: "1.3rem" }} />
                <div>
                  <h3 id="tracking-modal-title" style={{ margin: 0, fontSize: "1.15rem" }}>
                    Live Shipment Tracking #{selectedTracking.id}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    AWB: TRK-AIR-{(selectedTracking.id || "0000").replace("ord-", "")}89 &bull; Carrier: BlueDart Apex Logistics
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTracking(null)}
                className="legal-modal-close"
                aria-label="Close tracking dialog"
              >
                <FaTimes />
              </button>
            </div>

            <div className="legal-modal-body" style={{ padding: "1.5rem" }}>
              {/* Delivery ETA Badge */}
              <div
                style={{
                  background:
                    selectedTracking.status === "Delivered"
                      ? "#f0fdf4"
                      : selectedTracking.status === "Cancelled"
                      ? "#fef2f2"
                      : "#eff6ff",
                  border: `1px solid ${
                    selectedTracking.status === "Delivered"
                      ? "#bbf7d0"
                      : selectedTracking.status === "Cancelled"
                      ? "#fecaca"
                      : "#bfdbfe"
                  }`,
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
                    Estimated Delivery Date
                  </span>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FaCalendarAlt style={{ color: "#2563eb" }} />
                    {selectedTracking.status === "Delivered"
                      ? "Delivered Successfully"
                      : selectedTracking.status === "Cancelled"
                      ? "Order Cancelled"
                      : new Date(selectedTracking.estimatedDelivery || Date.now()).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    background:
                      selectedTracking.status === "Delivered"
                        ? "#16a34a"
                        : selectedTracking.status === "Cancelled"
                        ? "#dc2626"
                        : "#2563eb",
                    color: "#ffffff",
                  }}
                >
                  {selectedTracking.status}
                </span>
              </div>

              {/* Waypoint details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.85rem",
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <strong style={{ color: "#475569" }}>Origin Fulfillment Hub:</strong>
                  <div style={{ color: "#0f172a", marginTop: "0.2rem" }}>
                    Apex Logistics Center, Sector 18, MIDC Navi Mumbai, MH
                  </div>
                </div>
                <div>
                  <strong style={{ color: "#475569" }}>Destination Address:</strong>
                  <div style={{ color: "#0f172a", marginTop: "0.2rem" }}>
                    {selectedTracking.shippingAddress.address}, {selectedTracking.shippingAddress.city} - {selectedTracking.shippingAddress.pinCode}
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <h4 style={{ margin: "0 0 1rem", fontSize: "0.95rem", color: "#1e293b" }}>
                Courier Checkpoints & Security Audit
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#16a34a", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.75rem" }}>
                      ✓
                    </div>
                    <div style={{ width: "2px", height: "28px", background: selectedTracking.status !== "Processing" ? "#16a34a" : "#cbd5e1" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>Order Received & Inventory Reserved</strong>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Payment confirmed and verified via {selectedTracking.paymentMethod}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: selectedTracking.status !== "Processing" ? "#16a34a" : "#cbd5e1", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.75rem" }}>
                      {selectedTracking.status !== "Processing" ? "✓" : "2"}
                    </div>
                    <div style={{ width: "2px", height: "28px", background: selectedTracking.status === "Delivered" ? "#16a34a" : "#cbd5e1" }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>Packaging & Carrier Handoff</strong>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Quality-checked, tamper-proof seal applied, scanned onto linehaul</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: selectedTracking.status === "Delivered" ? "#16a34a" : "#cbd5e1", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.75rem" }}>
                      {selectedTracking.status === "Delivered" ? "✓" : "3"}
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>Final Mile Delivery</strong>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Delivered to consignee with digital POD signature</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="legal-modal-footer">
              <button
                type="button"
                onClick={() => setSelectedTracking(null)}
                className="btn-modal-done"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderHistory;
