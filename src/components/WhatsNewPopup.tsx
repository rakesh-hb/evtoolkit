import { useState } from "react";

interface Announcement {
  id: string;
  version: string;
  title: string;
  message: string;
}

interface WhatsNewPopupProps {
  announcement: Announcement;
  onAcknowledge: () => Promise<void>;
}

export default function WhatsNewPopup({
  announcement,
  onAcknowledge,
}: WhatsNewPopupProps) {
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAcknowledge() {
    if (saving) return;

    setSaving(true);
    setErrorMessage("");

    try {
      await onAcknowledge();
    } catch (error) {
      console.error("Failed to acknowledge announcement:", error);
      setErrorMessage(
        "We couldn't save your acknowledgement. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(2, 6, 23, 0.78)",
        backdropFilter: "blur(7px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "30px",
          borderRadius: 20,
          border: "1px solid rgba(59,130,246,0.3)",
          background: "var(--card-bg, #111827)",
          color: "var(--text-primary, #f8fafc)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginBottom: 20,
            background: "rgba(59,130,246,0.15)",
            fontSize: 27,
          }}
          aria-hidden="true"
        >
          ✨
        </div>

        <div
          style={{
            marginBottom: 9,
            color: "#f59e0b",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          EV Toolkit · What's New
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 11px",
            marginBottom: 15,
            borderRadius: 999,
            background: "rgba(59,130,246,0.15)",
            color: "#60a5fa",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          Version {announcement.version}
        </div>

        <h2
          id="whats-new-title"
          style={{
            margin: "0 0 14px",
            fontSize: 25,
            lineHeight: 1.3,
            fontWeight: 800,
            color: "var(--text-primary, #f8fafc)",
          }}
        >
          {announcement.title}
        </h2>

        <p
          style={{
            margin: 0,
            color: "var(--text-secondary, #cbd5e1)",
            fontSize: 15,
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {announcement.message}
        </p>

        {errorMessage && (
          <div
            role="alert"
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 10,
              border: "1px solid rgba(239,68,68,0.35)",
              background: "rgba(127,29,29,0.15)",
              color: "#fca5a5",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleAcknowledge}
          disabled={saving}
          style={{
            width: "100%",
            marginTop: 28,
            padding: "13px 20px",
            border: "none",
            borderRadius: 12,
            background: saving
              ? "#475569"
              : "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 800,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.75 : 1,
          }}
        >
          {saving ? "Saving..." : "Got it"}
        </button>
      </div>
    </div>
  );
}