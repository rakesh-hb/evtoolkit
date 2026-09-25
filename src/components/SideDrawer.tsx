import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";
import {
  getCurrentPlan,
  type SubscriptionPlan,
} from "../services/subscriptionService";

interface SideDrawerProps {
  open: boolean;
  currentPage: string;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const sections = [
  {
    title: "Maintenance",
    items: [
      { key: "service", icon: "🔧", label: "Service History" },
      { key: "tyres", icon: "◉", label: "Tyre History" },
      { key: "documents", icon: "▣", label: "Document Vault" },
      { key: "insurance", icon: "♢", label: "Insurance" },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", icon: "●", label: "User Profile" },
      { key: "settings", icon: "⚙", label: "Settings" },
    ],
  },
  {
    title: "Legal & Information",
    items: [
      { key: "terms", icon: "▤", label: "Terms & Conditions" },
      { key: "privacy", icon: "🔒", label: "Privacy Policy" },
      { key: "refund", icon: "↩", label: "Return & Refund Policy" },
      { key: "cancellation", icon: "×", label: "Cancellation Policy" },
      { key: "about", icon: "i", label: "About Us" },
    ],
  },
];

export default function SideDrawer({
  open,
  currentPage,
  onClose,
  onNavigate,
}: SideDrawerProps) {
  const { session } = useAuth();

  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");

  const [loadingSubscriptionPlan, setLoadingSubscriptionPlan] =
    useState(true);

  const firstName =
    session?.user?.user_metadata?.first_name || "";

  const email =
    session?.user?.email || "";

  const fullName =
    `${firstName} ${session?.user?.user_metadata?.last_name || ""}`.trim() ||
    session?.user?.user_metadata?.full_name ||
    "EV Toolkit User";

  const avatarLetter =
    firstName.charAt(0) || email.charAt(0) || "U";

  useEffect(() => {
    let mounted = true;

    async function loadSubscriptionPlan() {
      if (!session?.user?.id) {
        if (mounted) {
          setSubscriptionPlan("free");
          setLoadingSubscriptionPlan(false);
        }
        return;
      }

      setLoadingSubscriptionPlan(true);

      try {
        const plan = await getCurrentPlan();

        if (mounted) {
          setSubscriptionPlan(plan);
        }
      } catch (error) {
        console.error("Failed to load subscription plan:", error);

        if (mounted) {
          setSubscriptionPlan("free");
        }
      } finally {
        if (mounted) {
          setLoadingSubscriptionPlan(false);
        }
      }
    }

    void loadSubscriptionPlan();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const planLabel =
    subscriptionPlan === "premium_plus"
      ? "Premium Plus"
      : subscriptionPlan === "premium"
        ? "Premium"
        : "Free";

  const planStyle =
    subscriptionPlan === "premium_plus"
      ? {
          background: "rgba(59,130,246,0.16)",
          color: "#93c5fd",
          border: "1px solid rgba(59,130,246,0.38)",
        }
      : subscriptionPlan === "premium"
        ? {
            background: "rgba(239,68,68,0.14)",
            color: "#fca5a5",
            border: "1px solid rgba(239,68,68,0.35)",
          }
        : {
            background: "rgba(34,197,94,0.13)",
            color: "#86efac",
            border: "1px solid rgba(34,197,94,0.30)",
        };

  function navigate(page: string) {
    onNavigate(page);
    onClose();
  }

  async function handleLogout() {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to sign out.");
    }
  }

  const renderNavItem = (
    item: {
      key: string;
      icon: string;
      label: string;
    },
  ) => {
    const active = currentPage === item.key;

    return (
      <button
        key={item.key}
        onClick={() => navigate(item.key)}
        style={{
          width: "100%",
          minHeight: "46px",
          display: "flex",
          alignItems: "center",
          gap: "11px",
          border: "1px solid transparent",
          borderRadius: "11px",
          background: active
            ? "rgba(59,130,246,0.16)"
            : "transparent",
          color: active ? "#ffffff" : "#e2e8f0",
          padding: "9px 11px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: active ? 700 : 550,
          textAlign: "left",
          boxSizing: "border-box",
          transition: "all 0.18s ease",
        }}
        onMouseEnter={(event) => {
          if (!active) {
            event.currentTarget.style.background =
              "rgba(255,255,255,0.055)";
            event.currentTarget.style.color = "#f8fafc";
          }
        }}
        onMouseLeave={(event) => {
          if (!active) {
            event.currentTarget.style.background =
              "transparent";
            event.currentTarget.style.color = "#cbd5e1";
          }
        }}
      >
        <span
          style={{
            width: "30px",
            height: "30px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            background: active
              ? "rgba(59,130,246,0.24)"
              : "rgba(255,255,255,0.055)",
            color: active ? "#93c5fd" : "#e2e8f0",
            fontSize: "16px",
            lineHeight: 1,
          }}
        >
          {item.icon}
        </span>

        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.62)",
            backdropFilter: "blur(2px)",
            zIndex: 1000,
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : -320,
          width: "292px",
          maxWidth: "88vw",
          height: "100vh",
          background:
            "linear-gradient(180deg, #0f172a 0%, #111827 52%, #0b1220 100%)",
          color: "#f8fafc",
          borderRight: "1px solid rgba(255,255,255,0.10)",
          transition: "left 0.25s ease",
          zIndex: 1001,
          boxShadow: "14px 0 45px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            minHeight: "70px",
            padding: "15px 14px 14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "11px",
                background:
                  "linear-gradient(145deg, #2563eb, #1d4ed8)",
                boxShadow:
                  "0 6px 18px rgba(37,99,235,0.30)",
                fontSize: "20px",
              }}
            >
              ⚡
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                EV Toolkit
              </div>
              <div
                style={{
                  marginTop: "2px",
                  color: "#aab7c8",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                EV ownership companion
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            title="Close"
            style={{
              width: "38px",
              height: "38px",
              flexShrink: 0,
              border: "1px solid #dc2626",
              borderRadius: "9px",
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <div
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "scroll",
            overflowX: "hidden",
            padding: "12px 10px 18px",
            scrollbarWidth: "thin",
            scrollbarColor:
              "#475569 rgba(255,255,255,0.04)",
          }}
        >
          {sections.map((section) => (
            <div
              key={section.title}
              style={{
                paddingTop: "14px",
                paddingBottom: "13px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  padding: "8px 10px",
                  marginBottom: "6px",
                  background: "#334155",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "1.05px",
                  textTransform: "uppercase",
                }}
              >
                {section.title}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                }}
              >
                {section.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed user area */}
        <div
          style={{
            flexShrink: 0,
            padding: "10px 12px 12px",
            borderTop:
              "1px solid rgba(255,255,255,0.09)",
            background:
              "rgba(2,6,23,0.28)",
          }}
        >
          <button
            onClick={() => navigate("profile")}
            style={{
              width: "100%",
              border:
                currentPage === "profile"
                  ? "1px solid rgba(59,130,246,0.38)"
                  : "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              background:
                currentPage === "profile"
                  ? "rgba(59,130,246,0.12)"
                  : "rgba(255,255,255,0.035)",
              cursor: "pointer",
              padding: "10px",
              color: "#f8fafc",
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, #334155, #1e293b)",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  color: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {avatarLetter.toUpperCase()}
              </div>

              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fullName}
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 7px",
                    borderRadius: "999px",
                    fontSize: "10px",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    ...planStyle,
                  }}
                >
                  {loadingSubscriptionPlan
                    ? "Loading..."
                    : planLabel}
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              minHeight: "42px",
              marginTop: "8px",
              border:
                "1px solid rgba(248,113,113,0.32)",
              borderRadius: "10px",
              background: "#dc2626",
              padding: "9px 12px",
              cursor: "pointer",
              fontSize: "13px",
              textAlign: "left",
              color: "#ffffff",
              fontWeight: 700,
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "#b91c1c";
              event.currentTarget.style.borderColor =
                "rgba(248,113,113,0.50)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background =
                "#dc2626";
              event.currentTarget.style.borderColor =
                "rgba(248,113,113,0.32)";
            }}
          >
            ⏻ Logout
          </button>
        </div>
      </div>
    </>
  );
}
