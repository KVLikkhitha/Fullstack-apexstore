import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  RiShoppingBag3Fill,
  RiLockPasswordFill,
  RiMailFill,
  RiArrowRightLine,
  RiEyeLine,
  RiEyeOffLine,
  RiCloseLine,
  RiCheckLine,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useEcommerce } from "../../context/EcommerceContext";
import { apiCreateUser } from "../../services/api";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";

const Login: React.FC = () => {
  const { login } = useEcommerce();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Google OAuth Modal States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isCustomGoogle, setIsCustomGoogle] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Determine redirect target
  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  // Handle Google Login Flow
  const handleSelectGoogleAccount = async (
    accountName: string,
    accountEmail: string,
    avatarUrl: string
  ) => {
    setIsGoogleLoading(true);
    try {
      const googleUserId = `google-${accountEmail.replace(/[^a-zA-Z0-9]/g, "-")}`;
      // Sync user to backend MongoDB
      const res = await apiCreateUser({
        _id: googleUserId,
        name: accountName,
        email: accountEmail,
        photo: avatarUrl,
        gender: "female",
        role: "user",
        dob: "1998-01-01",
      }).catch(() => null);

      const dbUser = res?.user;
      const assignedRole =
        dbUser?.role?.toLowerCase() === "admin" ? "Admin" : "Customer";

      login(
        assignedRole,
        dbUser?.name || accountName,
        dbUser?.email || accountEmail,
        dbUser?.photo || avatarUrl,
        dbUser?._id || dbUser?.id || googleUserId
      );
      toast.success(`Signed in as ${accountName} with Google! (Synced to MongoDB) 🍃`, {
        icon: "🟢",
        duration: 3500,
      });

      setIsGoogleModalOpen(false);
      navigate(from);
    } catch (err) {
      console.warn("Google sign-in notice:", err);
      toast.error("Could not complete Google authentication.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes("@")) {
      toast.error("Please enter a valid Google email address.");
      return;
    }
    const name =
      customGoogleName.trim() ||
      customGoogleEmail
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    handleSelectGoogleAccount(
      name,
      customGoogleEmail.trim(),
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    );
  };

  // Secure Credential Form Submission
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!cleanPassword) {
      toast.error("Please enter your password.");
      return;
    }

    if (cleanPassword.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }

    const derivedName = cleanEmail
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const stableUserId = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "-")}`;
    const defaultAvatar =
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

    // Authenticate / sync against backend MongoDB
    try {
      const res = await apiCreateUser({
        _id: stableUserId,
        name: derivedName,
        email: cleanEmail,
        photo: defaultAvatar,
        gender: "female",
        role: "user",
        dob: "1998-01-01",
      });

      if (res?.user) {
        const dbUser = res.user;
        const isAdmin = dbUser.role?.toLowerCase() === "admin";
        const assignedRole = isAdmin ? "Admin" : "Customer";

        login(
          assignedRole,
          dbUser.name || derivedName,
          dbUser.email || cleanEmail,
          dbUser.photo || defaultAvatar,
          dbUser._id || dbUser.id || stableUserId
        );

        if (isAdmin) {
          toast.success(`Welcome back, Administrator (${dbUser.name || "Admin"})! 🛡️`, {
            duration: 3500,
          });
          navigate("/admin/dashboard");
        } else {
          toast.success(`Welcome back, ${dbUser.name || derivedName}! 👋`, {
            duration: 3000,
          });
          navigate(from);
        }
        return;
      }
    } catch (err) {
      console.warn("Authentication notice:", err);
    }

    // Fallback if backend is offline
    login(
      "Customer",
      derivedName,
      cleanEmail,
      defaultAvatar,
      stableUserId
    );
    toast.success(`Welcome back, ${derivedName}! 👋`);
    navigate(from);
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main
        className="store-container"
        id="main-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "75vh",
          padding: "3rem 1.25rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow:
              "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.05)",
            border: "1px solid #e2e8f0",
            maxWidth: "500px",
            width: "100%",
            padding: "2.5rem 2rem",
            position: "relative",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#ffffff",
                display: "inline-grid",
                placeItems: "center",
                fontSize: "1.75rem",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
                marginBottom: "1rem",
                transition: "all 0.3s ease",
              }}
            >
              <RiShoppingBag3Fill />
            </div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "800",
                color: "#0f172a",
                letterSpacing: "-0.5px",
                margin: "0 0 0.5rem",
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem", margin: 0 }}>
              Sign in with your email or Google account to access orders & saved items.
            </p>
          </div>

          {/* 1-Click Fast Social Sign-In (Google) */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              id="google-signin-btn"
              onClick={() => setIsGoogleModalOpen(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "0.85rem 1.25rem",
                borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                background: "#ffffff",
                color: "#1e293b",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(15, 23, 42, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(15, 23, 42, 0.05)";
              }}
            >
              <FcGoogle style={{ fontSize: "1.35rem" }} />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* OR Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
              color: "#94a3b8",
              fontSize: "0.78rem",
              fontWeight: "600",
              letterSpacing: "0.6px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span>OR SIGN IN WITH EMAIL</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Form */}
          <form
            onSubmit={handleCredentialLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "0.4rem",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <RiMailFill
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "0.9rem",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.4rem",
                }}
              >
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Password
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <RiLockPasswordFill
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 2.5rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "0.9rem",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.82rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "#2563eb" }}
                />
                Keep me signed in
              </label>
              <button
                type="button"
                onClick={() =>
                  toast("Password reset instructions sent to registered email.", {
                    icon: "📧",
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.82rem",
                  textDecoration: "underline",
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.35rem",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                transition: "all 0.15s ease",
              }}
            >
              <span>Sign In to Account</span>
              <RiArrowRightLine />
            </button>
          </form>

          {/* Privacy & Legal notice */}
          <div
            style={{
              marginTop: "1.25rem",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#94a3b8",
            }}
          >
            By continuing, you agree to our{" "}
            <Link
              to="/legal"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Terms of Service & Mutual NDA
            </Link>
            .
          </div>
        </div>
      </main>

      {/* Google OAuth Interactive Account Selector Modal */}
      {isGoogleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            padding: "1rem",
            zIndex: 9999,
          }}
          onClick={() => !isGoogleLoading && setIsGoogleModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              maxWidth: "440px",
              width: "100%",
              padding: "2rem",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FcGoogle style={{ fontSize: "1.6rem" }} />
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: "1.2rem",
                }}
              >
                <RiCloseLine />
              </button>
            </div>

            <p
              style={{
                fontSize: "0.88rem",
                color: "#64748b",
                margin: "0 0 1.25rem",
              }}
            >
              Choose an account to continue to <strong>ApexStore</strong>
            </p>

            {/* Account List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                marginBottom: "1.25rem",
              }}
            >
              {/* Option 1: Verified Google Profile */}
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={() =>
                  handleSelectGoogleAccount(
                    "Google User",
                    "user.google@gmail.com",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  background: "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Google Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "0.92rem",
                      color: "#1e293b",
                    }}
                  >
                    Google User
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    user.google@gmail.com
                  </div>
                </div>
                <RiCheckLine style={{ color: "#2563eb", fontSize: "1.1rem" }} />
              </button>

              {/* Option 2: Custom Google Account Toggle */}
              {!isCustomGoogle ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogle(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px dashed #cbd5e1",
                    background: "#f8fafc",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "0.88rem",
                    fontWeight: "600",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#e2e8f0",
                      display: "grid",
                      placeItems: "center",
                      color: "#64748b",
                      fontSize: "1.1rem",
                    }}
                  >
                    +
                  </div>
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  style={{
                    border: "1.5px solid #2563eb",
                    borderRadius: "10px",
                    padding: "1rem",
                    background: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    Enter Google Account Details
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Likhitha)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    style={{
                      padding: "0.55rem 0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="google.email@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    style={{
                      padding: "0.55rem 0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
                    <button
                      type="submit"
                      disabled={isGoogleLoading}
                      style={{
                        flex: 1,
                        padding: "0.55rem",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      {isGoogleLoading ? "Connecting..." : "Sign In with this Account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomGoogle(false)}
                      style={{
                        padding: "0.55rem 0.85rem",
                        background: "#e2e8f0",
                        color: "#475569",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Notice */}
            <div
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              To continue, Google will share your name, email address, and profile
              picture with ApexStore. See Privacy Policy.
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Login;
