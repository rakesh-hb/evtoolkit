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

const menu = [
  {
    title: "Maintenance",
    items: [
      {
        key: "service",
        icon: "🔧",
        label: "Service History",
      },
      {
        key: "tyres",
        icon: "🛞",
        label: "Tyre History",
      },
      {
        key: "documents",
        icon: "📁",
        label: "Document Vault",
      },
      {
        key: "insurance",
        icon: "🛡️",
        label: "Insurance",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "profile",
        icon: "👤",
        label: "User Profile",
      },
      {
        key: "settings",
        icon: "⚙️",
        label: "Settings",
      },
      {
        key: "about",
        icon: "ℹ️",
        label: "About us",
      },
      {
        key: "terms",
        icon: "📄",
        label: "Terms & Conditions",
      },
      {
        key: "privacy",
        icon: "🔒",
        label: "Privacy Policy",
      },
      {
        key: "refund",
        icon: "💳",
        label: "Return & Refund Policy",
      },
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
    session?.user?.user_metadata
      ?.first_name || "";

  const lastName =
    session?.user?.user_metadata
      ?.last_name || "";

  const email =
    session?.user?.email || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    session?.user?.user_metadata
      ?.full_name ||
    "EV Toolkit User";

  const avatarLetter =
    firstName.charAt(0) ||
    email.charAt(0) ||
    "U";

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
        console.error(
          "Failed to load subscription plan:",
          error
        );

        if (mounted) {
          setSubscriptionPlan("free");
        }
      } finally {
        if (mounted) {
          setLoadingSubscriptionPlan(false);
        }
      }
    }

    loadSubscriptionPlan();

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
          background: "#bfdbfe",
          color: "#1d4ed8",
          border: "1px solid #3b82f6",
        }
      : subscriptionPlan === "premium"
        ? {
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #ef4444",
          }
        : {
            background: "#dcfce7",
            color: "#15803d",
            border: "1px solid #22c55e",
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
      console.error(
        "Logout error:",
        error
      );

      alert(
        "Failed to sign out."
      );
    }
  }

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.4)",
            zIndex: 1000,
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : -280,
          width: 260,
          height: "100vh",
          background: "#ffffff",
          color: "#222",
          borderRight:
            "1px solid #ddd",
          transition: "0.25s",
          zIndex: 1001,
          boxShadow:
            "2px 0 12px rgba(0,0,0,.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 20,
            fontSize: 22,
            fontWeight: "bold",
            borderBottom:
              "1px solid #eee",
          }}
        >
          ⚡ EV Toolkit
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {menu.map((section) => (
            <div
              key={section.title}
            >
              <div
                style={{
                  padding:
                    "14px 18px 8px",
                  color: "#777",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {section.title}
              </div>

              {section.items.map(
                (item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      navigate(
                        item.key
                      )
                    }
                    style={{
                      width: "100%",
                      textAlign:
                        "left",
                      border: "none",
                      background:
                        currentPage ===
                        item.key
                          ? "#eef5ff"
                          : "white",
                      padding:
                        "14px 18px",
                      cursor:
                        "pointer",
                      fontSize: 16,
                      color: "#222",
                    }}
                  >
                    {item.icon}{" "}
                    {item.label}
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            navigate("profile")
          }
          style={{
            width: "100%",
            border: "none",
            background:
              currentPage ===
              "profile"
                ? "#eef5ff"
                : "transparent",
            cursor:
              "pointer",
            padding:
              "16px 18px",
            color: "inherit",
            textAlign:
              "left",
            borderTop:
              "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius:
                  "50%",
                background:
                  "#2563eb",
                color: "#fff",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: 18,
                fontWeight:
                  "bold",
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
                  fontWeight:
                    600,
                  fontSize: 14,
                  marginBottom:
                    5,
                  overflow:
                    "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
              >
                {fullName}
              </div>

              <div
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: 5,
                  padding:
                    "3px 8px",
                  borderRadius:
                    999,
                  fontSize: 11,
                  fontWeight:
                    600,
                  lineHeight: 1.2,
                  ...planStyle,
                  marginBottom: 4,
                }}
              >
                {loadingSubscriptionPlan
                  ? "Loading..."
                  : planLabel}

                {!loadingSubscriptionPlan && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    · Active
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#777",
                  overflow:
                    "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
              >
                {email}
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={
            handleLogout
          }
          style={{
            width: "100%",
            border: "none",
            borderTop:
              "1px solid #eee",
            background:
              "white",
            padding:
              "14px 18px",
            cursor:
              "pointer",
            fontSize: 15,
            textAlign:
              "left",
            color:
              "#dc2626",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}