import { useState, type FormEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEcommerce } from "../../../context/EcommerceContext";
import { FaTag, FaCheck, FaCopy, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allNumbers = "1234567890";
const allSymbols = "!@#$%&*";

const Coupon = () => {
  const { coupons, addCoupon } = useEcommerce();
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("SAVE");
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>("");

  const copyText = async (code: string) => {
    await window.navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return alert("Please select at least one character type");

    let result: string = prefix || "";
    const loopLength: number = Math.max(0, size - result.length);

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum: number = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result.toUpperCase());
    setIsCopied(false);
  };

  const activateCouponHandler = () => {
    if (!coupon) return;
    addCoupon({
      code: coupon,
      discountPercent: Number(discountPercent) || 10,
      minSpend: 1000,
      maxDiscount: 5000,
    });
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon Code Generator & Registry</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Prefix (e.g. FLASH, FESTIVE)"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={6}
              max={20}
            />

            <input
              type="number"
              placeholder="Discount Percentage %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              min={5}
              max={90}
            />

            <fieldset>
              <legend>Include Characters</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit">Generate Code</button>
          </form>

          {coupon && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "#f1f5f9",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <code style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e1b4b" }}>
                {coupon}
              </code>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => copyText(coupon)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "600",
                  }}
                >
                  {isCopied ? <FaCheck style={{ color: "#16a34a" }} /> : <FaCopy />}
                  {isCopied ? "Copied" : "Copy Code"}
                </button>

                <button
                  type="button"
                  onClick={activateCouponHandler}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "700",
                  }}
                >
                  <FaTag /> Activate on Storefront ({discountPercent}% OFF)
                </button>
              </div>
            </div>
          )}

          {/* Active Live Store Coupons List */}
          <div style={{ marginTop: "3rem" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaTag /> Active Storefront Coupons ({coupons.length})
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {coupons.map((c) => (
                <div
                  key={c.code}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ color: "#0f172a", display: "block" }}>
                      {c.code}
                    </strong>
                    <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: "700" }}>
                      {c.discountPercent}% OFF
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(c.code)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      padding: "0.4rem 0.6rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#475569",
                    }}
                    title="Copy coupon"
                  >
                    <FaCopy />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Link
                to="/cart"
                style={{
                  fontSize: "0.9rem",
                  color: "#2563eb",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <FaStore /> Test applying a coupon in customer cart &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Coupon;
