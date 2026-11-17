import { FaCookieBite, FaShieldAlt } from "react-icons/fa";
import { useEcommerce } from "../../context/EcommerceContext";

const CookieConsent = () => {
  const { cookieConsent, setCookieConsent, openLegalModal } = useEcommerce();

  if (cookieConsent !== "pending") return null;

  return (
    <aside
      className="cookie-consent-bar"
      role="region"
      aria-label="Cookie and Privacy Consent Preferences"
    >
      <div className="cookie-content">
        <div className="cookie-icon-wrap" aria-hidden="true">
          <FaCookieBite />
        </div>
        <div className="cookie-text">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <strong>Cookie & Privacy Transparency</strong>
            <span className="badge-compliance"><FaShieldAlt /> DPDP/GDPR</span>
          </div>
          <p>
            ApexStore utilizes necessary local storage to remember your cart, wishlist items, and encrypted session security. We never sell your personal data. By browsing our store, you agree to our{" "}
            <button
              type="button"
              className="cookie-legal-link"
              onClick={() => openLegalModal("nda")}
            >
              Non-Disclosure Agreement (NDA)
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="cookie-legal-link"
              onClick={() => openLegalModal("privacy")}
            >
              Privacy Policy
            </button>.
          </p>
        </div>
      </div>

      <div className="cookie-actions">
        <button
          type="button"
          onClick={() => setCookieConsent("essential")}
          className="btn-cookie-essential"
          aria-label="Accept essential cookies and storage only"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => setCookieConsent("accepted")}
          className="btn-cookie-accept"
          aria-label="Accept all cookies and analytics preferences"
        >
          Accept All Preferences
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;
