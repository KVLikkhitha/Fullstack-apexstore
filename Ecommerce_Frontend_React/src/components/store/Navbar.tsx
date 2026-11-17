import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  RiShoppingBag3Fill,
  RiHeart3Line,
  RiHeart3Fill,
  RiDashboardFill,
  RiShieldCheckLine,
  RiMenu3Line,
  RiCloseLine,
  RiHome4Line,
  RiFileList3Line,
  RiUser3Line,
} from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";

const Navbar = () => {
  const {
    cart,
    wishlist,
    toggleCartDrawer,
    currentUserRole,
    currentUserName,
    currentUserEmail,
    isAuthenticated,
    logout,
    toggleUserRole,
  } = useEcommerce();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
    setMobileSearchOpen(false);
  };

  return (
    <header className="site-header">
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Notification Announcement Bar */}
      <div className="store-top-announcement">
        <div className="announcement-text">
          <span>
            ⚡ Spring Super Sale: Use code <strong>SUPER50</strong> for up to 50% OFF! Free shipping &gt; ₹1,500
          </span>
        </div>
        <div className="announcement-actions">
          <Link to="/legal" className="announcement-link">
            <RiShieldCheckLine aria-hidden="true" />
            <span>Legal & NDA</span>
          </Link>
          <button
            onClick={toggleUserRole}
            className="admin-quick-switch"
            title="Toggle between Customer and Admin perspective"
            aria-label={`Toggle role perspective. Current role is ${currentUserRole}`}
          >
            <FaUserCircle aria-hidden="true" />
            <span>Role: <strong>{currentUserRole}</strong></span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="store-navbar" aria-label="Main Store Navigation">
        <div className="store-container navbar-inner">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
          </button>

          {/* Logo */}
          <Link to="/" className="brand-logo" aria-label="ApexStore Home">
            <div className="brand-icon" aria-hidden="true">
              <RiShoppingBag3Fill />
            </div>
            <span>ApexStore.</span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            className="navbar-search desktop-search"
            role="search"
            aria-label="Sitewide product search"
            onSubmit={handleSearchSubmit}
          >
            <button
              type="submit"
              className="search-icon-btn"
              aria-label="Submit search"
              title="Search catalog"
            >
              <BsSearch className="search-icon" aria-hidden="true" style={{ pointerEvents: "none" }} />
            </button>
            <input
              id="navbar-search-input"
              type="search"
              aria-label="Search products, brands, tech, wearables"
              placeholder="Search products, brands, tech, wearables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Desktop Navigation Links */}
          <div className="navbar-links" role="menubar">
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              aria-current={location.pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={location.pathname === "/search" ? "active" : ""}
              aria-current={location.pathname === "/search" ? "page" : undefined}
            >
              Catalog
            </Link>
            <Link
              to="/orders"
              className={location.pathname === "/orders" ? "active" : ""}
              aria-current={location.pathname === "/orders" ? "page" : undefined}
            >
              My Orders
            </Link>
            <Link
              to="/legal"
              className={location.pathname === "/legal" ? "active" : ""}
              aria-current={location.pathname === "/legal" ? "page" : undefined}
            >
              NDA & Trust
            </Link>
          </div>

          {/* User Actions */}
          <div className="navbar-actions">
            {/* Mobile Search Toggle Icon */}
            <button
              type="button"
              className="action-btn mobile-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search input"
              title="Search"
            >
              <BsSearch aria-hidden="true" />
            </button>

            {/* Wishlist button */}
            <Link
              to="/wishlist"
              className="action-btn"
              title="Saved Wishlist"
              aria-label={`Saved Wishlist, ${wishlist.length} items`}
            >
              {wishlist.length > 0 ? (
                <RiHeart3Fill style={{ color: "#ef4444" }} aria-hidden="true" />
              ) : (
                <RiHeart3Line aria-hidden="true" />
              )}
              {wishlist.length > 0 && (
                <span className="badge" aria-hidden="true">{wishlist.length}</span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => toggleCartDrawer(true)}
              className="action-btn"
              title="Shopping Bag"
              aria-label={`Shopping Bag, ${totalCartItems} items`}
            >
              <RiShoppingBag3Fill aria-hidden="true" />
              {totalCartItems > 0 && (
                <span className="badge" aria-hidden="true">{totalCartItems}</span>
              )}
            </button>

            {/* Admin Dashboard Entry Button - Only for Admin on desktop */}
            {isAuthenticated && currentUserRole === "Admin" && (
              <Link
                to="/admin/dashboard"
                className="admin-pill-btn desktop-only"
                title="Go to Administration Suite"
                aria-label="Go to Administration Suite"
              >
                <RiDashboardFill aria-hidden="true" />
                <span>Admin Suite</span>
              </Link>
            )}

            {/* User Account / Auth Actions on Desktop */}
            {isAuthenticated ? (
              <div className="nav-auth-group desktop-only">
                <Link
                  to="/profile"
                  className="nav-user-pill"
                  title={`View Profile: ${currentUserName} (${currentUserRole})`}
                  style={{ textDecoration: "none" }}
                >
                  {currentUserRole === "Admin" ? "🛡️" : "👤"}{" "}
                  {currentUserName ? currentUserName.split(" ")[0] : "User"}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="nav-logout-btn"
                  title="Sign out of your account"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="nav-signin-btn desktop-only"
                title="Sign in to your account"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Expandable Mobile Search Row */}
        {mobileSearchOpen && (
          <div className="mobile-search-row">
            <form
              className="mobile-search-form"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <BsSearch className="mobile-search-icon" aria-hidden="true" />
              <input
                type="search"
                autoFocus
                placeholder="Search products, brands, gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search catalog on mobile"
              />
              <button
                type="button"
                className="mobile-search-close"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
              >
                <RiCloseLine />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Slideout Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}
        aria-label="Mobile Navigation Menu"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="drawer-header">
          <Link
            to="/"
            className="brand-logo"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="ApexStore Home"
          >
            <div className="brand-icon" aria-hidden="true">
              <RiShoppingBag3Fill />
            </div>
            <span>ApexStore.</span>
          </Link>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Drawer User Card */}
        <div className="drawer-user-section">
          {isAuthenticated ? (
            <div className="drawer-user-card">
              <div className="user-avatar-badge">
                {currentUserRole === "Admin" ? "🛡️" : "👤"}
              </div>
              <div className="user-details">
                <strong>{currentUserName || "User"}</strong>
                <span>{currentUserEmail || "Logged in"}</span>
                <span className="role-chip">{currentUserRole}</span>
              </div>
              <Link
                to="/profile"
                className="drawer-profile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile &rarr;
              </Link>
            </div>
          ) : (
            <div className="drawer-login-cta">
              <p>Sign in to track orders, save wishlist items & checkout fast</p>
              <Link
                to="/login"
                className="btn-drawer-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Navigation Links */}
        <div className="drawer-links">
          <Link
            to="/"
            className={`drawer-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <RiHome4Line className="link-icon" />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className={`drawer-link ${location.pathname === "/search" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BsSearch className="link-icon" />
            <span>Product Catalog</span>
          </Link>
          <Link
            to="/orders"
            className={`drawer-link ${location.pathname === "/orders" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <RiFileList3Line className="link-icon" />
            <span>My Orders & Tracking</span>
          </Link>
          <Link
            to="/wishlist"
            className={`drawer-link ${location.pathname === "/wishlist" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <RiHeart3Line className="link-icon" />
            <span>Saved Wishlist</span>
            {wishlist.length > 0 && <span className="drawer-count">{wishlist.length}</span>}
          </Link>
          <button
            type="button"
            className="drawer-link drawer-btn-link"
            onClick={() => {
              setMobileMenuOpen(false);
              toggleCartDrawer(true);
            }}
          >
            <RiShoppingBag3Fill className="link-icon" />
            <span>Shopping Bag</span>
            {totalCartItems > 0 && <span className="drawer-count">{totalCartItems}</span>}
          </button>
          <Link
            to="/legal"
            className={`drawer-link ${location.pathname === "/legal" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <RiShieldCheckLine className="link-icon" />
            <span>NDA & Trust Center</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className={`drawer-link ${location.pathname === "/profile" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <RiUser3Line className="link-icon" />
              <span>My Profile & Settings</span>
            </Link>
          )}

          {/* Admin Suite Entry for Admin */}
          {isAuthenticated && currentUserRole === "Admin" && (
            <Link
              to="/admin/dashboard"
              className="drawer-admin-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <RiDashboardFill />
              <span>Open Admin Suite</span>
            </Link>
          )}
        </div>

        {/* Drawer Bottom Actions: Role Switch & Logout */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-role-switch"
            onClick={toggleUserRole}
          >
            <FaUserCircle />
            <span>Switch Role (Currently: <strong>{currentUserRole}</strong>)</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="drawer-logout-btn"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
