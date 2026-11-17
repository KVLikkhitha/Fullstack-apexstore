import { FaTrash, FaCheck, FaTruck, FaBox, FaClock, FaStore } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEcommerce } from "../../../context/EcommerceContext";

const TransactionManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useEcommerce();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <main className="product-management" style={{ padding: "3rem", textAlign: "center" }}>
          <h2>Order Not Found</h2>
          <Link to="/admin/transaction" style={{ color: "#2563eb", fontWeight: "600" }}>
            Return to Orders List
          </Link>
        </main>
      </div>
    );
  }

  const status = order.status;

  const updateHandler = (): void => {
    if (status === "Processing") {
      updateOrderStatus(order.id, "Shipped");
    } else if (status === "Shipped") {
      updateOrderStatus(order.id, "Delivered");
    } else {
      toast("This order is already marked as Delivered.", { icon: "📦" });
    }
  };

  const deleteHandler = (): void => {
    if (window.confirm("Are you sure you want to cancel and delete this order?")) {
      updateOrderStatus(order.id, "Cancelled");
      toast.error("Order cancelled.");
      setTimeout(() => {
        navigate("/admin/transaction");
      }, 600);
    }
  };

  const steps = [
    { label: "Placed", icon: <FaCheck />, done: true },
    {
      label: "Processing",
      icon: <FaClock />,
      done: status === "Processing" || status === "Shipped" || status === "Delivered",
      current: status === "Processing",
    },
    {
      label: "Shipped",
      icon: <FaTruck />,
      done: status === "Shipped" || status === "Delivered",
      current: status === "Shipped",
    },
    {
      label: "Delivered",
      icon: <FaBox />,
      done: status === "Delivered",
      current: status === "Delivered",
    },
  ];

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {/* Left Section: Order Items & Delivery Tracking */}
        <section className="order-items-section">
          <div className="section-heading-row">
            <div>
              <h2>Order Details ({order.id})</h2>
              <Link
                to="/orders"
                style={{
                  fontSize: "0.85rem",
                  color: "#2563eb",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  marginTop: "0.25rem",
                }}
              >
                <FaStore /> View in Customer Order Tracker
              </Link>
            </div>
            <span
              className={
                status === "Delivered"
                  ? "status-pill delivered"
                  : status === "Shipped"
                  ? "status-pill shipped"
                  : "status-pill processing"
              }
            >
              {status}
            </span>
          </div>

          {/* Stepper */}
          <div className="order-stepper">
            {steps.map((step, idx) => (
              <div
                key={step.label}
                className={`step-item ${step.done ? "done" : ""} ${
                  step.current ? "active" : ""
                }`}
              >
                <div className="step-circle">{step.icon}</div>
                <span className="step-label">{step.label}</span>
                {idx < steps.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          <h3 style={{ margin: "2rem 0 1rem 0", fontSize: "1.1rem" }}>
            Purchased Items ({order.orderItems.length})
          </h3>

          <div className="order-items-list">
            {order.orderItems.map((item) => (
              <div key={item.productId} className="transaction-product-card">
                <img src={item.photo} alt={item.name} />
                <div className="item-meta">
                  <Link to={`/admin/product/${item.productId}`}>
                    {item.name}
                  </Link>
                  <span className="unit-price">
                    ₹{item.price.toLocaleString("en-IN")} &times; {item.quantity}
                  </span>
                </div>
                <span className="item-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Section: Shipping & Payment Summary */}
        <article className="shipping-info-card">
          <button
            type="button"
            className="product-delete-btn"
            onClick={deleteHandler}
            title="Cancel Order"
          >
            <FaTrash />
          </button>

          <h2>Order Summary</h2>

          <div className="summary-block">
            <h5>Customer Details</h5>
            <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
            <p><strong>Email:</strong> {order.userEmail}</p>
            <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            <p>
              <strong>Address:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pinCode}
            </p>
          </div>

          <div className="summary-block">
            <h5>Payment Information</h5>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span className={`status-pill ${order.paymentStatus === "Paid" ? "in-stock" : "low-stock"}`}>
                {order.paymentStatus}
              </span>
            </p>
            <p>
              <strong>Order Placed:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="summary-block amount-block">
            <h5>Amount Breakdown</h5>
            <div className="amount-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="amount-row">
              <span>Tax (5% GST)</span>
              <span>₹{order.tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="amount-row">
              <span>Shipping</span>
              <span>{order.shippingCharges === 0 ? "FREE" : `₹${order.shippingCharges}`}</span>
            </div>
            {order.discount > 0 && (
              <div className="amount-row discount">
                <span>Discount</span>
                <span>-₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="amount-row total-row">
              <span>Grand Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="button"
            className={`btn-process ${status === "Delivered" ? "btn-delivered" : ""}`}
            onClick={updateHandler}
          >
            {status === "Processing" && "Mark As Dispatched / Shipped"}
            {status === "Shipped" && "Mark As Successfully Delivered"}
            {status === "Delivered" && "Order Fully Delivered"}
          </button>
        </article>
      </main>
    </div>
  );
};

export default TransactionManagement;
