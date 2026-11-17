import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaFileContract,
  FaShieldAlt,
  FaLock,
  FaUndo,
  FaPrint,
  FaArrowLeft,
  FaSignature,
  FaAward,
} from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";
import Navbar from "../../components/store/Navbar";
import Footer from "../../components/store/Footer";
import CartDrawer from "../../components/store/CartDrawer";
import toast from "react-hot-toast";

const LegalCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "nda";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { isNdaSigned, signNdaAgreement, currentUserName, currentUserEmail } =
    useEcommerce();

  // Signature Form State
  const [signerName, setSignerName] = useState<string>(currentUserName || "");
  const [signerCompany, setSignerCompany] = useState<string>("Independent Tech Buyer");
  const [agreedToAllClauses, setAgreedToAllClauses] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSignNda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      toast.error("Please enter full signer legal name");
      return;
    }
    if (!agreedToAllClauses) {
      toast.error("Please check the confirmation box to certify agreement");
      return;
    }
    signNdaAgreement(signerName.trim(), signerCompany.trim());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="store-wrapper">
      <Navbar />

      <main className="store-container legal-center-page" id="main-content">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#64748b",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            <FaArrowLeft /> Return to Store
          </Link>
        </div>

        {/* Title Header */}
        <div className="legal-header-card">
          <div className="legal-header-info">
            <span className="badge-compliance">
              <FaShieldAlt /> Global Commercial Compliance & Privacy
            </span>
            <h1>ApexStore Legal, NDA & Trust Center</h1>
            <p>
              Review all mutual confidentiality obligations, vendor agreements, buyer protections,
              and data privacy disclosures under international trade laws and DPDP regulations.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="btn-print-doc"
            aria-label="Print or save current legal document"
          >
            <FaPrint /> Print / Save PDF
          </button>
        </div>

        {/* Tabs & Document Layout */}
        <div className="legal-layout-grid">
          {/* Side Tabs Navigation */}
          <aside className="legal-sidebar-tabs" role="tablist" aria-label="Legal document selection">
            <button
              role="tab"
              aria-selected={activeTab === "nda"}
              className={`legal-nav-btn ${activeTab === "nda" ? "active" : ""}`}
              onClick={() => handleTabChange("nda")}
            >
              <FaFileContract className="nav-icon" />
              <div>
                <strong>Mutual NDA Agreement</strong>
                <span>Confidentiality & Trade Secrets</span>
              </div>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "terms"}
              className={`legal-nav-btn ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => handleTabChange("terms")}
            >
              <FaShieldAlt className="nav-icon" />
              <div>
                <strong>Terms of Service</strong>
                <span>Purchases, Warranty & Liability</span>
              </div>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "privacy"}
              className={`legal-nav-btn ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => handleTabChange("privacy")}
            >
              <FaLock className="nav-icon" />
              <div>
                <strong>Privacy & DPDP</strong>
                <span>Data Protection & Cookie Notice</span>
              </div>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "refund"}
              className={`legal-nav-btn ${activeTab === "refund" ? "active" : ""}`}
              onClick={() => handleTabChange("refund")}
            >
              <FaUndo className="nav-icon" />
              <div>
                <strong>30-Day Returns Policy</strong>
                <span>RMA & Replacement Flow</span>
              </div>
            </button>
          </aside>

          {/* Active Document Viewer */}
          <section className="legal-content-card" aria-live="polite">
            {activeTab === "nda" && (
              <article className="legal-article">
                <div className="legal-doc-meta">
                  <span className="doc-tag">Document Reference: NDA-APEX-2026-REV4</span>
                  <span>Effective Date: Immediate</span>
                </div>
                <h2>Mutual Non-Disclosure Agreement (NDA) & Commercial Confidentiality</h2>
                <p className="lead">
                  This Mutual Non-Disclosure Agreement ("Agreement") governs the exchange of proprietary technical,
                  commercial, and pricing information between <strong>ApexStore Inc.</strong> and the Buyer/Enterprise Partner.
                </p>

                <div className="callout-box">
                  <strong>Important Notice for Commercial & Enterprise Clients:</strong>
                  <p>
                    Access to bulk wholesale tiered pricing, unreleased product blueprints, customized enterprise hardware specs,
                    and proprietary logistics workflows requires digital execution of this NDA.
                  </p>
                </div>

                <h3>1. Purpose of Agreement</h3>
                <p>
                  The parties wish to explore, negotiate, and execute electronic procurement transactions involving
                  high-performance electronics, proprietary chipsets, computing gear, and premium athletic apparel.
                  During this engagement, either party may disclose proprietary trade information ("Confidential Information").
                </p>

                <h3>2. Scope of Confidential Information</h3>
                <p>
                  Confidential Information includes without limitation:
                </p>
                <ul>
                  <li>Advance hardware benchmark test results and unannounced release dates.</li>
                  <li>Enterprise volume discount matrices and wholesale coupon codes.</li>
                  <li>Customer database records, order history analytics, and shipping addresses.</li>
                  <li>Custom silicon, motherboard layouts, and proprietary component architectures.</li>
                </ul>

                <h3>3. Standard of Care & Protection</h3>
                <p>
                  The Receiving Party agrees to treat all Confidential Information with the same degree of care it accords to its own
                  proprietary secrets (and not less than a reasonable standard of diligence). Information will not be reverse engineered,
                  decompiled, published, or transmitted to competitors.
                </p>

                <h3>4. Duration of Confidentiality</h3>
                <p>
                  The non-disclosure obligations created by this Agreement continue in full force and effect for three (3) years
                  from the date of execution, or for as long as trade secret status persists under applicable statutory law.
                </p>

                {/* Digital Signature & Certification Box */}
                <div className="digital-signature-section">
                  <div className="section-head">
                    <FaSignature style={{ color: "#2563eb", fontSize: "1.4rem" }} />
                    <h3>Electronic Signature & Verification Certificate</h3>
                  </div>

                  {isNdaSigned ? (
                    <div className="signed-certificate-card">
                      <div className="cert-header">
                        <FaAward style={{ fontSize: "2rem", color: "#16a34a" }} />
                        <div>
                          <h4>Legally Executed Non-Disclosure Certificate</h4>
                          <span>Certificate ID: CERT-894210 | SHA-256 Validated</span>
                        </div>
                      </div>
                      <div className="cert-details">
                        <div>
                          <strong>Executed By:</strong> {signerName || currentUserName}
                        </div>
                        <div>
                          <strong>Entity/Company:</strong> {signerCompany}
                        </div>
                        <div>
                          <strong>Email:</strong> {currentUserEmail}
                        </div>
                        <div>
                          <strong>Verification Timestamp:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div>
                          <strong>Status:</strong> <span style={{ color: "#16a34a", fontWeight: "700" }}>ACTIVE & FULLY BINDING</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSignNda} className="nda-form">
                      <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                        Please enter your full legal name and affiliation to digitally record your mutual NDA acceptance.
                      </p>

                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="signer-name">Full Signer Legal Name *</label>
                          <input
                            id="signer-name"
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan"
                            value={signerName}
                            onChange={(e) => setSignerName(e.target.value)}
                          />
                        </div>

                        <div className="form-field">
                          <label htmlFor="signer-company">Entity or Company Name</label>
                          <input
                            id="signer-company"
                            type="text"
                            placeholder="e.g. Acme Corp or Personal Account"
                            value={signerCompany}
                            onChange={(e) => setSignerCompany(e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="checkbox-agreement">
                        <input
                          type="checkbox"
                          checked={agreedToAllClauses}
                          onChange={(e) => setAgreedToAllClauses(e.target.checked)}
                          required
                        />
                        <span>
                          I certify that I have read, understood, and voluntarily execute this Mutual Non-Disclosure Agreement
                          with full legal authority to bind myself or my organization.
                        </span>
                      </label>

                      <button type="submit" className="btn-sign-submit">
                        <FaSignature /> Execute & Digitally Sign NDA
                      </button>
                    </form>
                  )}
                </div>
              </article>
            )}

            {activeTab === "terms" && (
              <article className="legal-article">
                <div className="legal-doc-meta">
                  <span>Document Reference: TOS-APEX-2026-V1</span>
                  <span>Effective Date: January 1, 2026</span>
                </div>
                <h2>ApexStore Terms of Service & Commercial Conditions</h2>
                <p className="lead">
                  Welcome to ApexStore. These Terms govern your purchase of goods, use of services, and relationship with us.
                </p>

                <h3>1. Acceptance of Terms</h3>
                <p>
                  By creating an account, browsing the catalog, placing an order, or utilizing coupons, you agree to be bound by these
                  Terms and all incorporated policies including the Mutual NDA and Privacy Policy.
                </p>

                <h3>2. Electronic Transactions & Payments</h3>
                <p>
                  We accept major credit/debit cards, Unified Payments Interface (UPI), NetBanking, and Cash on Delivery (COD).
                  Payment authorization is processed via PCI-DSS compliant secure gateways.
                </p>

                <h3>3. Pricing Accuracy & Orders</h3>
                <p>
                  While we strive for 100% price accuracy, errors may rarely occur. If an item is listed at an incorrect price due to typographical
                  error, ApexStore reserves the right to cancel the order and provide a full prompt refund.
                </p>

                <h3>4. Warranties & Limitation of Liability</h3>
                <p>
                  Products are accompanied by standard manufacturer warranties. ApexStore disclaims incidental or consequential damages
                  arising from product misuse or unauthorized hardware alterations.
                </p>
              </article>
            )}

            {activeTab === "privacy" && (
              <article className="legal-article">
                <div className="legal-doc-meta">
                  <span>Regulation: DPDP Act 2023 / GDPR Compliant</span>
                  <span>Version: 3.1</span>
                </div>
                <h2>Privacy Policy & Customer Data Protection</h2>
                <p className="lead">
                  ApexStore is committed to uncompromising data privacy, end-to-end encryption, and full customer transparency.
                </p>

                <h3>1. Personal Data Collected</h3>
                <p>
                  We collect names, shipping addresses, telephone numbers, and email addresses solely to deliver purchases and generate tax invoices.
                </p>

                <h3>2. Local Storage & Cookies</h3>
                <p>
                  Our application stores your shopping bag items, wishlist products, and theme preferences in your local browser storage.
                  We do not embed third-party tracking cookies or sell behavioral profile records to advertising brokers.
                </p>

                <h3>3. Security Measures</h3>
                <p>
                  All transactions operate over TLS 1.3 encryption. Passwords and sensitive session tokens are salted and hashed.
                </p>
              </article>
            )}

            {activeTab === "refund" && (
              <article className="legal-article">
                <div className="legal-doc-meta">
                  <span>Policy ID: RETURN-RMA-2026</span>
                  <span>Window: 30 Calendar Days</span>
                </div>
                <h2>30-Day Hassle-Free Return & Replacement Guarantee</h2>
                <p className="lead">
                  We guarantee total satisfaction with every product delivered. If something isn't right, we make it effortless to replace or refund.
                </p>

                <h3>1. Return Eligibility</h3>
                <p>
                  Products must be returned within 30 days of documented courier delivery with original packaging, tags, accessories,
                  and proof of purchase intact.
                </p>

                <h3>2. How to Initiate a Return</h3>
                <p>
                  Navigate to your <strong>My Orders</strong> page, select the completed order, and click "Initiate Return / Warranty Claim".
                  A pre-paid courier pickup label will be issued within 24 hours.
                </p>

                <h3>3. Refund Processing Times</h3>
                <p>
                  Once the item arrives at our fulfillment facility and passes quality check, refunds will be credited within 3-5 business days.
                </p>
              </article>
            )}
          </section>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default LegalCenter;
