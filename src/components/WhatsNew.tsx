import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Announcement {
  id: string;
  version: string;
  title: string;
  message: string;
  created_at: string;
}

function formatAnnouncementDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function WhatsNewPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAnnouncements() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("app_announcements")
        .select("id, version, title, message, created_at")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Failed to load release announcements:", error);
        setErrorMessage("We couldn't load the release updates. Please try again.");
        setAnnouncements([]);
      } else {
        setAnnouncements(data ?? []);
      }

      setLoading(false);
    }

    void loadAnnouncements();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        padding: "28px 22px 48px",
        boxSizing: "border-box",
        color: "var(--text-primary, #f8fafc)",
      }}
    >
      <header style={{ marginBottom: 26 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#f59e0b",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          <span aria-hidden="true">✨</span>
          EV Toolkit Updates
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(26px, 4vw, 34px)",
            lineHeight: 1.2,
            fontWeight: 800,
            color: "var(--text-primary, #f8fafc)",
          }}
        >
          What's New
        </h1>
        <p
          style={{
            margin: "10px 0 0",
            maxWidth: 650,
            color: "var(--text-secondary, #94a3b8)",
            fontSize: 14,
            lineHeight: 1.65,
          }}
        >
          Explore the latest features, improvements, and updates to EV Toolkit.
          Previous release notes remain available here.
        </p>
      </header>

      <section
        aria-labelledby="live-fuel-prices-update"
        style={{
          marginBottom: 18,
          padding: "22px 22px 20px",
          borderRadius: 16,
          border: "1px solid rgba(34,197,94,0.28)",
          background:
            "linear-gradient(145deg, rgba(20,83,45,0.18), var(--card-bg, rgba(255,255,255,0.04)))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
            color: "#86efac",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span aria-hidden="true">⛽</span>
          Analytics improvement
        </div>
        <h2
          id="live-fuel-prices-update"
          style={{
            margin: "0 0 10px",
            color: "var(--text-primary, #f8fafc)",
            fontSize: 19,
            lineHeight: 1.35,
            fontWeight: 750,
          }}
        >
          Live Local Fuel Prices in EV Savings
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--text-secondary, #cbd5e1)",
            fontSize: 14,
            lineHeight: 1.75,
          }}
        >
          The Approximate EV Savings &amp; CO₂ Avoided section now uses
          petrol and diesel prices retrieved from API Mitra for the city
          saved in your User Profile. If a city price is unavailable, EV
          Toolkit tries the saved state. The displayed prices include the
          provider's last-updated time. If live prices cannot be retrieved,
          the calculation clearly identifies that it is using fallback
          benchmark prices instead. Keep your City and State up to date in
          User Profile for the most relevant lookup.
        </p>
      </section>

      {loading && (
        <div
          role="status"
          style={{
            padding: 24,
            borderRadius: 14,
            background: "var(--card-bg, rgba(255,255,255,0.04))",
            color: "var(--text-secondary, #94a3b8)",
          }}
        >
          Loading release updates...
        </div>
      )}

      {!loading && errorMessage && (
        <div
          role="alert"
          style={{
            padding: 18,
            borderRadius: 14,
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#fca5a5",
            background: "rgba(127,29,29,0.12)",
          }}
        >
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && announcements.length === 0 && (
        <div
          style={{
            padding: 24,
            borderRadius: 14,
            border: "1px solid var(--border-color, rgba(148,163,184,0.18))",
            background: "var(--card-bg, rgba(255,255,255,0.04))",
            color: "var(--text-secondary, #94a3b8)",
            lineHeight: 1.6,
          }}
        >
          No release updates have been published yet. Check back here for
          future EV Toolkit updates.
        </div>
      )}

      {!loading && !errorMessage && announcements.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              style={{
                padding: "22px 22px 20px",
                borderRadius: 16,
                border: "1px solid var(--border-color, rgba(148,163,184,0.18))",
                background: "var(--card-bg, rgba(255,255,255,0.04))",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: "rgba(59,130,246,0.14)",
                    color: "#60a5fa",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Version {announcement.version}
                </span>
                <time
                  dateTime={announcement.created_at}
                  style={{
                    color: "var(--text-secondary, #94a3b8)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {formatAnnouncementDate(announcement.created_at)}
                </time>
              </div>
              <h2
                style={{
                  margin: "0 0 10px",
                  color: "var(--text-primary, #f8fafc)",
                  fontSize: 19,
                  lineHeight: 1.35,
                  fontWeight: 750,
                }}
              >
                {announcement.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary, #cbd5e1)",
                  fontSize: 14,
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {announcement.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
