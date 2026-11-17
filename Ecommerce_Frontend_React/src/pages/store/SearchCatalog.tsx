import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import ProductCard from "../../components/store/ProductCard";
import CartDrawer from "../../components/store/CartDrawer";
import { BsSearch, BsFilter, BsGrid3X3GapFill, BsListUl } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const categories = [
  "All",
  "Laptops",
  "Footwear",
  "Audio",
  "Wearables",
  "Cameras",
  "Mobile Phones",
];

const pricePresets = [
  { label: "Any", max: 200000 },
  { label: "< ₹15K", max: 15000 },
  { label: "< ₹35K", max: 35000 },
  { label: "< ₹75K", max: 75000 },
  { label: "< ₹1.5L", max: 150000 },
];

const SearchCatalog = () => {
  const { products } = useEcommerce();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current query parameters directly as source of truth
  const selectedCategory = searchParams.get("category") || "All";
  const searchParam = searchParams.get("q") || "";

  // Local input state for smooth typing without lag
  const [searchInput, setSearchInput] = useState<string>(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState<string>(searchParam);

  // Sync search input if URL searchParam changed externally
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setSearchInput(searchParam);
  }

  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Handle filter changes
  const handleCategorySelect = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete("q");
    } else {
      newParams.set("q", val.trim());
    }
    setSearchParams(newParams, { replace: true });
  };

  const resetFilters = () => {
    setSearchInput("");
    setMaxPrice(200000);
    setInStockOnly(false);
    setSortBy("featured");
    setSearchParams({});
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search match
        const matchesSearch =
          !searchParam ||
          product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.category.toLowerCase().includes(searchParam.toLowerCase()) ||
          (product.brand &&
            product.brand.toLowerCase().includes(searchParam.toLowerCase()));

        // Category match
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;

        // Price match
        const matchesPrice = product.price <= maxPrice;

        // In Stock match
        const matchesStock = !inStockOnly || product.stock > 0;

        return (
          matchesSearch && matchesCategory && matchesPrice && matchesStock
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return 0; // featured default
      });
  }, [products, searchParam, selectedCategory, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container catalog-page" id="main-content">
        {/* Header Breadcrumb */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Explore Catalog
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Browse through our verified collection of high-grade gadgets, hardware, and lifestyle gear.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-toggle-wrap">
          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            aria-expanded={showMobileFilters}
          >
            <BsFilter aria-hidden="true" />
            <span>
              {showMobileFilters ? "Hide Filter Options ▲" : "Show Filter Options & Categories ▼"}
            </span>
          </button>
        </div>

        <div className="catalog-layout">
          {/* Filter Sidebar */}
          <aside
            className={`filter-sidebar ${showMobileFilters ? "mobile-visible" : ""}`}
            aria-label="Product Filters"
          >
            <div className="filter-header">
              <h3>
                <BsFilter aria-hidden="true" /> Filters
              </h3>
              <button
                className="reset-btn"
                onClick={resetFilters}
                aria-label="Reset all applied filters"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="filter-group">
              <label htmlFor="catalog-filter-search">Keyword Search</label>
              <div style={{ position: "relative" }}>
                <BsSearch
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="catalog-filter-search"
                  type="search"
                  placeholder="Filter by name or brand..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  aria-label="Filter products by name or brand"
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem 0.55rem 2rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <span className="filter-group-label" style={{ fontWeight: 600, fontSize: "0.9rem", color: "#334155", display: "block", marginBottom: "0.5rem" }}>Category</span>
              <div className="category-list" role="radiogroup" aria-label="Filter by category">
                {categories.map((cat) => (
                  <label key={cat} className="category-radio">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={() => handleCategorySelect(cat)}
                      aria-label={`Category ${cat}`}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range & Quick Presets */}
            <div className="filter-group">
              <label htmlFor="price-range-input">
                Max Price: ₹{maxPrice.toLocaleString("en-IN")}
              </label>
              <div className="price-slider-wrap">
                <input
                  id="price-range-input"
                  type="range"
                  min="1000"
                  max="200000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-valuemin={1000}
                  aria-valuemax={200000}
                  aria-valuenow={maxPrice}
                  aria-label="Maximum price filter slider"
                />
                <div className="price-labels">
                  <span>₹1,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                {pricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMaxPrice(preset.max)}
                    style={{
                      background: maxPrice === preset.max ? "#2563eb" : "#f1f5f9",
                      color: maxPrice === preset.max ? "#ffffff" : "#475569",
                      border: "none",
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                    aria-label={`Set max price to ${preset.label}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="filter-group">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: "#2563eb" }}
                  aria-label="Exclude out of stock products"
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>
          </aside>

          {/* Catalog Main Products Content */}
          <section className="catalog-main" aria-label="Catalog Products">
            <div className="catalog-top-bar">
              <span
                className="results-count"
                aria-live="polite"
              >
                Showing <strong>{filteredProducts.length}</strong> items
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* View Mode Toggle */}
                <div
                  style={{
                    display: "inline-flex",
                    background: "#f1f5f9",
                    borderRadius: "8px",
                    padding: "2px",
                    border: "1px solid #cbd5e1",
                  }}
                  role="group"
                  aria-label="View layout mode"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid layout view"
                    style={{
                      background: viewMode === "grid" ? "#ffffff" : "transparent",
                      border: "none",
                      color: viewMode === "grid" ? "#2563eb" : "#64748b",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <BsGrid3X3GapFill />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List layout view"
                    style={{
                      background: viewMode === "list" ? "#ffffff" : "transparent",
                      border: "none",
                      color: viewMode === "list" ? "#2563eb" : "#64748b",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <BsListUl />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label htmlFor="sort-select" style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Sort:
                  </label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort products by"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest SKUs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(searchParam || selectedCategory !== "All" || maxPrice < 200000 || inStockOnly) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
                  Active Filters:
                </span>

                {searchParam && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.25rem 0.6rem",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                    }}
                  >
                    Search: "{searchParam}"
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", display: "grid", placeItems: "center" }}
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}

                {selectedCategory !== "All" && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.25rem 0.6rem",
                      background: "#f0fdf4",
                      color: "#15803d",
                      border: "1px solid #bbf7d0",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                    }}
                  >
                    Category: {selectedCategory}
                    <button
                      type="button"
                      onClick={() => handleCategorySelect("All")}
                      style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", display: "grid", placeItems: "center" }}
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}

                {maxPrice < 200000 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.25rem 0.6rem",
                      background: "#faf5ff",
                      color: "#7e22ce",
                      border: "1px solid #e9d5ff",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                    }}
                  >
                    Price &le; ₹{maxPrice.toLocaleString("en-IN")}
                    <button
                      type="button"
                      onClick={() => setMaxPrice(200000)}
                      style={{ background: "none", border: "none", color: "#7e22ce", cursor: "pointer", display: "grid", placeItems: "center" }}
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.25rem 0.6rem",
                      background: "#fff7ed",
                      color: "#c2410c",
                      border: "1px solid #fed7aa",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                    }}
                  >
                    In Stock Only
                    <button
                      type="button"
                      onClick={() => setInStockOnly(false)}
                      style={{ background: "none", border: "none", color: "#c2410c", cursor: "pointer", display: "grid", placeItems: "center" }}
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h2 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "0.5rem" }}>
                  No matching products found
                </h2>
                <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                  Try adjusting your search query, increasing your price limit, or
                  resetting category filters.
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  aria-label="Reset all filters to defaults"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "products-grid" : "products-list"}
                style={
                  viewMode === "list"
                    ? { display: "flex", flexDirection: "column", gap: "1rem" }
                    : {}
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default SearchCatalog;
