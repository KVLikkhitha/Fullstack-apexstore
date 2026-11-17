import { useEffect } from "react";
import { FaTimes, FaShieldAlt, FaFileContract, FaLock, FaUndo } from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";

const LegalModal = () => {
  const { isLegalModalOpen, legalModalTab, closeLegalModal, openLegalModal, isNdaSigned, signNdaAgreement, currentUserName } = useEcommerce();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLegalModalOpen) {
        closeLegalModal();
      }
    };
    if (isLegalModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLegalModalOpen, closeLegalModal]);

  if (!isLegalModalOpen) return null;

  return (
    <div
      className="legal-modal-overlay"
      onClick={closeLegalModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="legal-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="legal-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <FaShieldAlt style={{ color: "#2563eb", fontSize: "1.3rem" }} />
            <h2 id="legal-modal-title" style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
              ApexStore Legal & Compliance Center
            </h2>
          </div>
          <button
            onClick={closeLegalModal}
            className="legal-modal-close"
            aria-label="Close legal compliance dialog"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="legal-modal-tabs" role="tablist" aria-label="Legal document categories">
          <button
            role="tab"
            aria-selected={legalModalTab === "nda"}
            className={`legal-tab-btn ${legalModalTab === "nda" ? "active" : ""}`}
            onClick={() => openLegalModal("nda")}
          >
            <FaFileContract /> NDA & Confidentiality
          </button>
          <button
            role="tab"
            aria-selected={legalModalTab === "terms"}
            className={`legal-tab-btn ${legalModalTab === "terms" ? "active" : ""}`}
            onClick={() => openLegalModal("terms")}
          >
            <FaShieldAlt /> Terms of Service
          </button>
          <button
            role="tab"
            aria-selected={legalModalTab === "privacy"}
            className={`legal-tab-btn ${legalModalTab === "privacy" ? "active" : ""}`}
            onClick={() => openLegalModal("privacy")}
          >
            <FaLock /> Privacy & DPDP
          </button>
          <button
            role="tab"
            aria-selected={legalModalTab === "refund"}
            className={`legal-tab-btn ${legalModalTab === "refund" ? "active" : ""}`}
            onClick={() => openLegalModal("refund")}
          >
            <FaUndo /> 30-Day Returns
          </button>
        </div>

        {/* Content Body */}
        <div className="legal-modal-body">
          {legalModalTab === "nda" && (
            <div className="legal-doc-content">
              <h3>Mutual Non-Disclosure Agreement (NDA) & Commercial Confidentiality</h3>
              <p className="legal-sub">Effective Date: October 2026 | Version 2.4 (Enterprise & Consumer)</p>
              
              <div className="legal-notice-box">
                <strong>🔒 Commercial Confidentiality Clause:</strong>
                <p>
                  By transacting on ApexStore or viewing proprietary technical hardware configurations, wholesale pricing tiers, or unreleased device benchmarks, both parties enter into this legally binding mutual confidentiality agreement.
                </p>
              </div>

              <h4>1. Definition of Confidential Information</h4>
              <p>
                Confidential information encompasses all unreleased product schematics, wholesale discounts, enterprise procurement quotations, custom silicon benchmark data, customer transaction records, and proprietary firmware documentation transmitted through the platform.
              </p>

              <h4>2. Obligations & Restrictive Covenants</h4>
              <p>
                The Receiving Party covenants to maintain strict secrecy and exercise reasonable commercial diligence. Information shall not be disclosed, scraped, reverse-engineered, or distributed to non-authorized third parties without written authorization.
              </p>

              <h4>3. Term & IP Protection</h4>
              <p>
                Obligations survive for a period of three (3) years post-transaction. All trademarks, patents, design patents, and copyrights remain the exclusive intellectual property of ApexStore Inc. and its verified brand partners.
              </p>

              <div className="nda-sign-box">
                {isNdaSigned ? (
                  <div className="nda-signed-badge">
                    ✅ <strong>NDA Digitally Signed & Active</strong>
                    <span>Verified for: {currentUserName} | Status: Compliant</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <strong>Acknowledge & Electronically Sign NDA</strong>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                        Click to record digital signature verification for this session.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-sign-nda"
                      onClick={() => signNdaAgreement(currentUserName || "Customer User", "Personal/Commercial Account")}
                    >
                      Digitally Sign NDA &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {legalModalTab === "terms" && (
            <div className="legal-doc-content">
              <h3>Terms of Service & E-Commerce Conditions</h3>
              <p className="legal-sub">Last updated: October 2026 | ApexStore Global</p>
              
              <h4>1. Order Placement & Acceptance</h4>
              <p>
                Receipt of an order confirmation does not signify final acceptance of your order. ApexStore reserves the right to verify inventory, credit, and pricing accuracy prior to shipping.
              </p>

              <h4>2. Pricing, Taxes & Invoicing</h4>
              <p>
                All prices listed include or clearly state applicable Goods and Services Tax (GST/VAT). Detailed tax invoices are generated upon dispatch and accessible through Order History.
              </p>

              <h4>3. Shipping, Title & Risk of Loss</h4>
              <p>
                Risk of loss passes to the customer upon delivery to the confirmed shipping address. All shipments above ₹1,500 qualify for free express courier service.
              </p>
            </div>
          )}

          {legalModalTab === "privacy" && (
            <div className="legal-doc-content">
              <h3>Privacy Policy & Data Protection (DPDP & GDPR Compliant)</h3>
              <p className="legal-sub">Transparency & Trust in Data Handling</p>

              <h4>1. Information We Collect</h4>
              <p>
                We collect transaction logs, delivery addresses, and encrypted payment tokens necessary for order fulfillment. We never store raw CVV codes or payment card numbers.
              </p>

              <h4>2. Cookie & Local Storage Usage</h4>
              <p>
                We use browser localStorage strictly for your shopping cart persistence, wishlist state, authentication sessions, and privacy preferences. No cross-site ad tracker pixels are sold.
              </p>

              <h4>3. Customer Rights & Data Erasure</h4>
              <p>
                You retain the right to inspect, download, or request deletion of your account information at any time by contacting compliance@apexstore.io.
              </p>
            </div>
          )}

          {legalModalTab === "refund" && (
            <div className="legal-doc-content">
              <h3>30-Day Hassle-Free Returns & Replacement Policy</h3>
              <p className="legal-sub">Complete Customer Peace of Mind</p>

              <h4>1. Eligible Return Window</h4>
              <p>
                Hardware and apparel products may be returned within 30 days of confirmed delivery if in original box condition with accessories and warranty cards intact.
              </p>

              <h4>2. Replacement & Defect Guarantee</h4>
              <p>
                Dead-on-arrival (DOA) units receive priority 48-hour pickup and express doorstep replacement.
              </p>

              <h4>3. Refund Timeline</h4>
              <p>
                Refunds are processed back to the original payment source (Card, UPI, NetBanking) within 3-5 business days upon warehouse receipt.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="legal-modal-footer">
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Governed by Cyber Law & Commercial Trade Treaties.
          </span>
          <button onClick={closeLegalModal} className="btn-modal-done">
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
