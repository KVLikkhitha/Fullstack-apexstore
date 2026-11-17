import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./components/admin/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieConsent from "./components/store/CookieConsent";
import LegalModal from "./components/store/LegalModal";
import { EcommerceProvider, useEcommerce } from "./context/EcommerceContext";
import "./styles/app.scss";

// Lazy-loaded Storefront Pages
const Home = lazy(() => import("./pages/store/Home"));
const SearchCatalog = lazy(() => import("./pages/store/SearchCatalog"));
const ProductDetails = lazy(() => import("./pages/store/ProductDetails"));
const CartPage = lazy(() => import("./pages/store/CartPage"));
const Checkout = lazy(() => import("./pages/store/Checkout"));
const OrderSuccess = lazy(() => import("./pages/store/OrderSuccess"));
const OrderHistory = lazy(() => import("./pages/store/OrderHistory"));
const Wishlist = lazy(() => import("./pages/store/Wishlist"));
const LegalCenter = lazy(() => import("./pages/store/LegalCenter"));
const Login = lazy(() => import("./pages/store/Login"));
const Profile = lazy(() => import("./pages/store/Profile"));

// Lazy-loaded Admin Pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const AppRoutes = () => {
  const { isAuthenticated, currentUserRole } = useEcommerce();
  const isAdmin = currentUserRole === "Admin";

  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchCatalog />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/legal" element={<LegalCenter />} />
      <Route path="/login" element={<Login />} />

      {/* Customer Protected Routes (Requires Login) */}
      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            redirect="/login"
          />
        }
      >
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Quick redirect from /admin to /admin/dashboard */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* Admin Protected Routes (Only accessible when authenticated as Admin) */}
      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            adminRoute={true}
            isAdmin={isAdmin}
            redirect="/login"
          />
        }
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/product" element={<Products />} />
        <Route path="/admin/customer" element={<Customers />} />
        <Route path="/admin/transaction" element={<Transaction />} />

        {/* Charts */}
        <Route path="/admin/chart/bar" element={<Barcharts />} />
        <Route path="/admin/chart/pie" element={<Piecharts />} />
        <Route path="/admin/chart/line" element={<Linecharts />} />

        {/* Apps */}
        <Route path="/admin/app/coupon" element={<Coupon />} />
        <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
        <Route path="/admin/app/toss" element={<Toss />} />

        {/* Management */}
        <Route path="/admin/product/new" element={<NewProduct />} />
        <Route path="/admin/product/:id" element={<ProductManagement />} />
        <Route
          path="/admin/transaction/:id"
          element={<TransactionManagement />}
        />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <EcommerceProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>

        {/* Sitewide Global Overlays */}
        <CookieConsent />
        <LegalModal />
        <Toaster
          position="bottom-center"
          gutter={8}
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "10px",
              background: "#1e293b",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: "500",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            },
          }}
        />
      </Router>
    </EcommerceProvider>
  );
}

export default App;
