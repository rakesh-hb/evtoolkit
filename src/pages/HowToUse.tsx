import { useState } from "react";

type Section = {
  id: string;
  icon: string;
  title: string;
  description: string;
  steps: string[];
};

const sections: Section[] = [
  {
    id: "getting-started",
    icon: "🏠",
    title: "Getting Started",
    description:
      "Start with your vehicle and use the Dashboard as the central overview of your EV ownership information.",
    steps: [
      "Sign in to EV Toolkit.",
      "Open Settings and select your Primary Vehicle. EV Toolkit uses this vehicle as the default vehicle across the application.",
      "Optionally set a Dashboard Vehicle Alias if you want a custom display name on the Dashboard.",
      "Use the bottom navigation for Home, Planner, Charging and Analytics. Use More to open the side drawer for the other sections.",
    ],
  },
  {
    id: "charging",
    icon: "🔋",
    title: "Charging Tracker",
    description:
      "Use Charging to record your actual charging activity. These records are also the source data used by Analytics.",
    steps: [
      "Open Charging from the bottom navigation.",
      "Add a charging session and select the relevant vehicle.",
      "Enter the charging date, charging type, energy used and cost, and add station information when available.",
      "Save the session after checking the entered values.",
      "Use the recent-session area to review your recorded charging activity.",
    ],
  },
  {
    id: "planner",
    icon: "⚡",
    title: "Planner",
    description:
      "Use Planner for EV ownership and trip planning. Planned activity should not be treated as completed charging activity.",
    steps: [
      "Open Planner from the bottom navigation.",
      "Select the vehicle and enter the trip or planning information.",
      "Review the estimated energy, charging time, range and cost shown by the planner.",
      "Use the planning result as an estimate for the trip or ownership decision.",
      "Record actual charging separately in Charging Tracker so it can be included in Analytics.",
    ],
  },
  {
    id: "analytics",
    icon: "📊",
    title: "Analytics",
    description:
      "Analytics turns your recorded charging sessions into totals, averages, trends, distributions and recent-session summaries.",
    steps: [
      "Open Analytics from the bottom navigation.",
      "Review the charging totals, energy and cost summaries.",
      "Use the weekly activity and charging-type distribution to understand charging patterns.",
      "Review monthly trends and the recent charging sessions section.",
      "Premium and Premium Plus users can use the Analytics PDF export when available on their subscription.",
      "Analytics results depend on the accuracy and completeness of the charging records entered in Tracker.",
    ],
  },
  {
    id: "records",
    icon: "🗂️",
    title: "Service, Tyres, Insurance & Documents",
    description:
      "The side drawer contains the main ownership-record sections for keeping your EV information organised.",
    steps: [
      "Service History: record maintenance and service work performed on your vehicle.",
      "Tyre History: record tyre replacements, warranty information and related details.",
      "Insurance: maintain policy information, renewal dates, premium details, add-ons and supported policy documents.",
      "Document Vault: keep supported vehicle documents and attachments organised.",
      "Use the search, edit and record-management controls available on each page to maintain your information.",
    ],
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Settings, Vehicles, Family & Backup",
    description:
      "Settings controls your vehicle context, family sharing and the backup capabilities available on your subscription.",
    steps: [
      "Primary Vehicle: select the vehicle EV Toolkit should use as the default vehicle across the application.",
      "Dashboard Vehicle Alias: optionally create a display alias without renaming the underlying vehicle.",
      "Family Sharing: invite eligible family members and manage the family according to the subscription rules.",
      "Backup & Restore: use the backup options available to your current plan.",
      "Premium supports manual local Backup & Restore. Premium Plus adds cloud and automatic-backup capabilities.",
      "Keep exported backup files in a secure location.",
    ],
  },
  {
    id: "profile",
    icon: "👤",
    title: "User Profile",
    description:
      "User Profile is where you manage your personal account information and password.",
    steps: [
      "Open More and select User Profile.",
      "Update your first name, last name and phone number when required.",
      "Your authentication email is managed by your authentication account.",
      "Use Change Password to update your password. The application requires a minimum password length and prevents reuse of previously used passwords.",
      "Use Logout when you want to end the current authenticated session.",
    ],
  },
  {
    id: "plans",
    icon: "⭐",
    title: "Subscription Features",
    description:
      "EV Toolkit has Free, Premium and Premium Plus capabilities. Features and limits depend on the active subscription.",
    steps: [
      "Free provides the basic application features with limits on selected record types.",
      "Premium provides unlimited records, additional Analytics capabilities, Analytics PDF export, family sharing and manual local Backup & Restore.",
      "Premium Plus includes Premium capabilities plus file uploads, Document Vault, cloud storage, cloud backup and automatic backup capabilities.",
      "The exact feature availability shown in the application is controlled by the current subscription status.",
    ],
  },
];

export default function HowToUse() {
  const [openSection, setOpenSection] = useState("getting-started");

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "22px 16px 100px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          padding: "22px",
          borderRadius: "16px",
          background:
            "linear-gradient(145deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "28px" }}>📖</span>
          <h1
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            How to Use EV Toolkit
          </h1>
        </div>

        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          A quick guide to the main EV Toolkit features and how they work
          together. You can return to this guide at any time from the More
          menu.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {sections.map((section, index) => {
          const isOpen = openSection === section.id;

          return (
            <section
              key={section.id}
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                background: "rgba(15,23,42,0.94)",
                border: isOpen
                  ? "1px solid rgba(59,130,246,0.38)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenSection(isOpen ? "" : section.id)
                }
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "15px 16px",
                  border: "0",
                  background: isOpen
                    ? "rgba(59,130,246,0.10)"
                    : "transparent",
                  color: "#f8fafc",
                  cursor: "pointer",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    background: isOpen
                      ? "rgba(59,130,246,0.20)"
                      : "rgba(255,255,255,0.055)",
                    fontSize: "19px",
                  }}
                >
                  {section.icon}
                </span>

                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "15px",
                      fontWeight: 800,
                      marginBottom: "3px",
                    }}
                  >
                    {index + 1}. {section.title}
                  </span>
                  <span
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      fontSize: "12px",
                      lineHeight: 1.45,
                    }}
                  >
                    {section.description}
                  </span>
                </span>

                <span
                  style={{
                    color: "#93c5fd",
                    fontSize: "18px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: "0 18px 18px 66px",
                    color: "#cbd5e1",
                  }}
                >
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: "18px",
                      fontSize: "13px",
                      lineHeight: 1.65,
                    }}
                  >
                    {section.steps.map((step) => (
                      <li
                        key={step}
                        style={{
                          marginBottom: "7px",
                        }}
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "18px",
          padding: "15px 16px",
          borderRadius: "12px",
          background: "rgba(249,115,22,0.09)",
          border: "1px solid rgba(249,115,22,0.24)",
          color: "#fed7aa",
          fontSize: "12px",
          lineHeight: 1.55,
        }}
      >
        <strong>Tip:</strong> Start with Settings to select your Primary
        Vehicle, record actual charging in Charging Tracker, and then use
        Analytics to understand the charging data you have recorded.
      </div>
    </div>
  );
}
