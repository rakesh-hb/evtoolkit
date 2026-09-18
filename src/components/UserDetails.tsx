import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import { supabase } from "../lib/supabase";

interface UserDetailsData {
  name: string;
  email: string;
}

interface UserDetailsProps {
  onClick?: () => void;
}

export default function UserDetails({
  onClick,
}: UserDetailsProps) {
  const [user, setUser] = useState<UserDetailsData>({
    name: "User",
    email: "",
  });

  useEffect(() => {
    loadUserDetails();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser({
            name: "User",
            email: "",
          });
          return;
        }

        setUser(
          getUserDetails(session.user)
        );
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function loadUserDetails() {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        return;
      }

      setUser(
        getUserDetails(data.user)
      );
    } catch (error) {
      console.error(
        "Failed to load user details:",
        error
      );
    }
  }

  function getUserDetails(
    authUser: {
      email?: string | null;
      user_metadata?: Record<
        string,
        unknown
      >;
    }
  ): UserDetailsData {
    const metadata =
      authUser.user_metadata ?? {};

    const name =
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string"
          ? metadata.name
          : typeof metadata.display_name ===
              "string"
            ? metadata.display_name
            : authUser.email?.split("@")[0] ||
              "User";

    return {
      name: name.trim() || "User",
      email: authUser.email ?? "",
    };
  }

  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0).toUpperCase()
      )
      .join("") || "U";

  return (
    <button
      type="button"
      className="userDetails"
      onClick={onClick}
      disabled={!onClick}
      aria-label={
        onClick
          ? "Open user profile"
          : "User details"
      }
      title={
        onClick
          ? "Open user profile"
          : undefined
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        padding: "7px 11px",
        borderRadius: "12px",
        background:
          "rgba(255,255,255,0.06)",
        border:
          "1px solid rgba(255,255,255,0.10)",
        boxSizing: "border-box",
        color: "inherit",
        font: "inherit",
        textAlign: "inherit",
        cursor: onClick
          ? "pointer"
          : "default",
        transition:
          "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(event) => {
        if (!onClick) {
          return;
        }

        event.currentTarget.style.background =
          "rgba(255,255,255,0.10)";
        event.currentTarget.style.borderColor =
          "rgba(255,255,255,0.18)";
      }}
      onMouseLeave={(event) => {
        if (!onClick) {
          return;
        }

        event.currentTarget.style.background =
          "rgba(255,255,255,0.06)";
        event.currentTarget.style.borderColor =
          "rgba(255,255,255,0.10)";
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "34px",
          height: "34px",
          minWidth: "34px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(145deg, #2563eb, #7c3aed)",
          color: "#ffffff",
          boxShadow:
            "0 0 16px rgba(59,130,246,0.22)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
          }}
        >
          {initials}
        </span>
      </div>

      <div
        style={{
          minWidth: 0,
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: "#f8fafc",
            fontFamily:
              '"Inter", "Segoe UI", Arial, sans-serif',
            fontSize: "13px",
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user.name}
        </div>

        {user.email && (
          <div
            style={{
              marginTop: "2px",
              color: "#94a3b8",
              fontFamily:
                '"Inter", "Segoe UI", Arial, sans-serif',
              fontSize: "10px",
              fontWeight: 400,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "210px",
            }}
          >
            {user.email}
          </div>
        )}
      </div>

      <UserRound
        size={15}
        color="#94a3b8"
        aria-hidden="true"
      />
    </button>
  );
}
