import { useState } from "react";

interface WhatsNewAnnouncement {
  id: string;
  version: string;
  title: string;
  message: string;
}

interface WhatsNewProps {
  announcement: WhatsNewAnnouncement;
  onAcknowledge: () => Promise<void>;
}

export default function WhatsNew({
  announcement,
  onAcknowledge,
}: WhatsNewProps) {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAcknowledge = async () => {
    if (saving) return;

    setSaving(true);
    setErrorMessage("");

    try {
      await onAcknowledge();
    } catch (error) {
      console.error("Unable to acknowledge What's New:", error);
      setErrorMessage(
        "We couldn't save your acknowledgement. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0, 0, 0, 0.72)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        aria-describedby="whats-new-message"
        style={{
          width: "min(100%, 560px)",
          maxHeight: "min(80vh, 680px)",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "28px 26px 24px",
          borderRadius: 20,
          background: "#ffffff",
          color: "#172033",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.32)",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 11px",
            borderRadius: 999,
            background: "#fff2e8",
            color: "#d96516",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          <span aria-hidden="true">✨</span>
          What's New · {announcement.version}
        </div>

        <h2
          id="whats-new-title"
          style={{
            margin: "18px 0 12px",
            color: "#111827",
            fontSize: 25,
            lineHeight: 1.25,
            fontWeight: 750,
          }}
        >
          {announcement.title}
        </h2>

        <div
          id="whats-new-message"
          style={{
            color: "#4b5563",
            fontSize: 15,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {announcement.message}
        </div>

        {typeof navigator !== "undefined" &&
          (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) && (
            <section
              aria-label="Add EV Toolkit to your Home Screen"
              style={{
                marginTop: 20, padding: "14px 16px", borderRadius: 12,
                background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e3a8a",
              }}
            >
              <strong style={{ display: "block", marginBottom: 7 }}>
                📱 Add EV Toolkit to your Home Screen
              </strong>
              <ol style={{ margin: 0, paddingLeft: 21, fontSize: 13, lineHeight: 1.7 }}>
                <li>Open EV Toolkit in Safari.</li>
                <li>Tap <strong>Share</strong>.</li>
                <li>Select <strong>More</strong>.</li>
                <li>Select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
              </ol>
            </section>
          )}

        {errorMessage && (
          <p
            role="alert"
            style={{
              margin: "18px 0 0",
              color: "#b42318",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleAcknowledge}
          disabled={saving}
          style={{
            width: "100%",
            minHeight: 48,
            marginTop: 26,
            padding: "12px 18px",
            border: "none",
            borderRadius: 12,
            background: saving ? "#9ca3af" : "#f47721",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saving ? "Saving..." : "Got it"}
        </button>
      </section>
    </div>
  );
}
