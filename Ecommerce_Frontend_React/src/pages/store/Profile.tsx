import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaShoppingBag,
  FaHeart,
  FaShieldAlt,
  FaArrowRight,
  FaSignOutAlt,
  FaCheckCircle,
  FaSave,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const {
    currentUserName,
    currentUserEmail,
    currentUserPhone,
    currentUserAddress,
    currentUserRole,
    orders,
    wishlist,
    updateUserProfile,
    logout,
  } = useEcommerce();

  const navigate = useNavigate();

  // Local form state
  const [name, setName] = useState(currentUserName);
  const [email, setEmail] = useState(currentUserEmail);
  const [phone, setPhone] = useState(currentUserPhone);
  const [address, setAddress] = useState(currentUserAddress);
  const [avatar, setAvatar] = useState(
    currentUserRole === "Admin"
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp"
      : "https://randomuser.me/api/portraits/women/54.jpg"
  );
  const [isEditing, setIsEditing] = useState(false);

  // Compute metrics
  const myOrders =
    currentUserRole === "Admin"
      ? orders
      : orders.filter((o) => {
          return (
            (o.userEmail &&
              currentUserEmail &&
              o.userEmail.toLowerCase() === currentUserEmail.toLowerCase()) ||
            (o.user &&
              currentUserName &&
              o.user.toLowerCase() === currentUserName.toLowerCase())
          );
        });

  const totalSpent = myOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      avatar: avatar.trim(),
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main
        className="store-container"
        id="main-content"
        style={{ padding: "3rem 1.25rem 5rem", maxWidth: "1100px" }}
      >
        {/* Profile Header Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            color: "#ffffff",
            boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.25)",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={avatar}
                alt={currentUserName}
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://randomuser.me/api/portraits/women/54.jpg";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  background: "#10b981",
                  border: "2px solid #0f172a",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                }}
                title="Active"
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "0.4rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {currentUserName}
                </h1>
                <span
                  style={{
                    background:
                      currentUserRole === "Admin"
                        ? "rgba(59, 130, 246, 0.25)"
                        : "rgba(16, 185, 129, 0.25)",
                    border: `1px solid ${
                      currentUserRole === "Admin"
                        ? "rgba(59, 130, 246, 0.5)"
                        : "rgba(16, 185, 129, 0.5)"
                    }`,
                    color: currentUserRole === "Admin" ? "#93c5fd" : "#6ee7b7",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {currentUserRole === "Admin" ? "🛡️ System Admin" : "Verified Customer"}
                </span>
              </div>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  margin: "0 0 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaEnvelope style={{ color: "#64748b" }} /> {currentUserEmail}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  📞 {currentUserPhone || "+91 98201 12345"}
                </span>
                <span>
                  📍 {currentUserAddress ? currentUserAddress.slice(0, 32) + "..." : "India"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: isEditing ? "#3b82f6" : "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "0.7rem 1.4rem",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#fca5a5",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "0.7rem 1.2rem",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Total Orders
              </span>
              <div
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FaShoppingBag />
              </div>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" }}>
              {myOrders.length}
            </div>
            <Link
              to="/orders"
              style={{
                fontSize: "0.82rem",
                color: "#2563eb",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.25rem",
              }}
            >
              View Order History &rarr;
            </Link>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Wishlist Items
              </span>
              <div
                style={{
                  background: "#fef2f2",
                  color: "#ef4444",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FaHeart />
              </div>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" }}>
              {wishlist.length}
            </div>
            <Link
              to="/wishlist"
              style={{
                fontSize: "0.82rem",
                color: "#ef4444",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.25rem",
              }}
            >
              View Saved Wishlist &rarr;
            </Link>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Lifetime Spend
              </span>
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1rem",
                }}
              >
                ₹
              </div>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" }}>
              ₹{totalSpent.toLocaleString("en-IN")}
            </div>
            <span style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: "600" }}>
              Verified Tier Member
            </span>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                Account Security
              </span>
              <div
                style={{
                  background: "#faf5ff",
                  color: "#9333ea",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FaShieldAlt />
              </div>
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.5rem",
              }}
            >
              <FaCheckCircle /> Protected & Verified
            </div>
            <Link
              to="/legal"
              style={{
                fontSize: "0.82rem",
                color: "#9333ea",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.5rem",
              }}
            >
              Inspect Legal & NDA &rarr;
            </Link>
          </div>
        </div>

        {/* Edit Form or Account Overview */}
        {isEditing ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "1.5rem",
              }}
            >
              Update Account Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 12345"
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#334155",
                    marginBottom: "0.5rem",
                  }}
                >
                  Primary Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.85rem 1.75rem",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    padding: "0.85rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Quick Navigation Cards */}
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "1.25rem",
          }}
        >
          Account Hub & Shortcuts
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <Link
            to="/orders"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.3rem",
                }}
              >
                <FaShoppingBag />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Order Management
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0.25rem 0 0" }}>
                  Live shipment fulfillment & invoices
                </p>
              </div>
            </div>
            <FaArrowRight style={{ color: "#94a3b8" }} />
          </Link>

          <Link
            to="/wishlist"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  background: "#fef2f2",
                  color: "#ef4444",
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.3rem",
                }}
              >
                <FaHeart />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Saved Favorites
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0.25rem 0 0" }}>
                  {wishlist.length} items saved for later
                </p>
              </div>
            </div>
            <FaArrowRight style={{ color: "#94a3b8" }} />
          </Link>

          {currentUserRole === "Admin" && (
            <Link
              to="/admin/dashboard"
              style={{
                background: "#ffffff",
                border: "1px solid #bfdbfe",
                borderRadius: "18px",
                padding: "1.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    width: "50px",
                    height: "50px",
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  <FaShieldAlt />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e40af", margin: 0 }}>
                    Administration Suite
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0.25rem 0 0" }}>
                    Full inventory, analytics & customer CRM
                  </p>
                </div>
              </div>
              <FaArrowRight style={{ color: "#2563eb" }} />
            </Link>
          )}

          <Link
            to="/legal"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.3rem",
                }}
              >
                <FaShieldAlt />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  NDA & Legal Compliance
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0.25rem 0 0" }}>
                  Digital signature records & privacy
                </p>
              </div>
            </div>
            <FaArrowRight style={{ color: "#94a3b8" }} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
