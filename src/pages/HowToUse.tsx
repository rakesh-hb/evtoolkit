import { useState } from "react";

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function InfoSection({
  title,
  children,
  isOpen,
  onToggle,
}: InfoSectionProps) {

  return (
    <div
      style={{
        border: "1px solid rgba(148,163,184,0.20)",
        borderRadius: "14px",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          border: "none",
          background: "#ffffff",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          cursor: "pointer",
          textAlign: "left",
          color: "#0f172a",
          fontSize: "16px",
          fontWeight: 700,
        }}
      >
        <span>{title}</span>

        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            fontSize: "20px",
            lineHeight: 1,
            color: "#64748b",
          }}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "20px 22px 22px",
            color: "#334155",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function HowToUse() {
  const [openSection, setOpenSection] = useState<string | null>(
    "1. Getting Started"
  );

  function toggleSection(title: string) {
    setOpenSection((current) => (current === title ? null : title));
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "28px 20px 32px",
        background:
          "radial-gradient(circle at 15% 15%, rgba(37,99,235,0.16), transparent 28%), radial-gradient(circle at 85% 80%, rgba(14,165,233,0.12), transparent 30%), #07111f",
        color: "#f8fafc",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(120deg, transparent 0%, rgba(59,130,246,0.08) 48%, transparent 52%)",
          backgroundSize: "220% 220%",
          animation: "evEnergySweep 7s linear infinite",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "-40px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "1px solid rgba(56,189,248,0.22)",
          boxShadow:
            "0 0 35px rgba(37,99,235,0.16), inset 0 0 35px rgba(56,189,248,0.08)",
          animation: "evPulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-55px",
          bottom: "8%",
          width: "210px",
          height: "210px",
          borderRadius: "50%",
          border: "1px solid rgba(14,165,233,0.20)",
          boxShadow:
            "0 0 45px rgba(14,165,233,0.14), inset 0 0 40px rgba(37,99,235,0.08)",
          animation: "evPulse 5s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes evEnergySweep {
          0% { background-position: 200% 0; }
          100% { background-position: -20% 100%; }
        }

        @keyframes evPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
<div
  style={{
    marginBottom: "22px",
    textAlign: "center",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    }}
  >
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "linear-gradient(145deg, #172554, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        flexShrink: 0,
      }}
    >
      📖
    </div>

    <div>
      <h1
        style={{
          margin: 0,
          fontSize: "26px",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
        }}
      >
        How to Use EV Toolkit
      </h1>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "14px",
          color: "#f97316",
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        A quick guide to the main features of EV Toolkit.
      </p>
    </div>
  </div>
</div>

        {/* Guide sections */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <InfoSection
            title="1. Getting Started"
            isOpen={openSection === "1. Getting Started"}
            onToggle={() => toggleSection("1. Getting Started")}
          >
            <p style={{ margin: "0 0 12px" }}>
              EV Toolkit is designed to help you manage your EV ownership
              information from one place.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              After signing in, start by checking your vehicle information and
              Primary Vehicle selection in Settings. The selected Primary
              Vehicle is used by supported parts of the application when
              displaying vehicle-related information.
            </p>

            <p style={{ margin: 0 }}>
              You can use the Dashboard as your starting point and then move
              between Charging Tracker, Planner, Analytics and the vehicle
              record sections from the application menu.
            </p>
          </InfoSection>

          <InfoSection
            title="2. Dashboard"
            isOpen={openSection === "2. Dashboard"}
            onToggle={() => toggleSection("2. Dashboard")}
          >
            <p style={{ margin: "0 0 12px" }}>
              The Dashboard provides a quick overview of your EV information
              and recent activity.
            </p>

            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
              }}
            >
              <li>Review your selected vehicle.</li>
              <li>View charging activity and key totals.</li>
              <li>Review recent activity.</li>
              <li>Use the available dashboard cards to navigate to related features.</li>
            </ul>
          </InfoSection>

          <InfoSection
            title="3. Charging Tracker"
            isOpen={openSection === "3. Charging Tracker"}
            onToggle={() => toggleSection("3. Charging Tracker")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Charging Tracker is used to record your charging sessions.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Enter the information available for a charging session, such as
              date, energy, cost and other supported details. Saved charging
              sessions are used by Analytics to calculate charging activity,
              energy and cost information.
            </p>

            <p style={{ margin: 0 }}>
              Keep charging records accurate because Analytics depends on the
              underlying Tracker data.
            </p>
          </InfoSection>

          <InfoSection
            title="4. Planner"
            isOpen={openSection === "4. Planner"}
            onToggle={() => toggleSection("4. Planner")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Planner helps you estimate charging and trip-related information
              using the inputs available in the application.
            </p>

            <p style={{ margin: 0 }}>
              Use the available vehicle, battery, charging and trip inputs to
              estimate energy requirements, charging time, range and charging
              cost where supported.
            </p>
          </InfoSection>

          <InfoSection
            title="5. Service History"
            isOpen={openSection === "5. Service History"}
            onToggle={() => toggleSection("5. Service History")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Service History is used to maintain a chronological record of
              vehicle servicing and maintenance.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Use it to record completed maintenance work, service information,
              dates, mileage, costs and other supported details.
            </p>

            <p style={{ margin: 0 }}>
              Supporting receipts or documents can be attached where the
              feature is available for your subscription.
            </p>
          </InfoSection>

          <InfoSection
            title="6. Tyre History"
            isOpen={openSection === "6. Tyre History"}
            onToggle={() => toggleSection("6. Tyre History")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Tyre History is used to maintain tyre-related records.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Record tyre replacements and other significant tyre-related
              information supported by the page.
            </p>

            <p style={{ margin: 0 }}>
              Keep separate records when a new tyre set or significant
              tyre-related event needs to be retained.
            </p>
          </InfoSection>

          <InfoSection
            title="7. Insurance"
            isOpen={openSection === "7. Insurance"}
            onToggle={() => toggleSection("7. Insurance")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Insurance is used to maintain your vehicle insurance information.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              You can record supported information such as the insurance
              company, policy number, policy type, dates, premium, IDV,
              add-ons, agent details and notes.
            </p>

            <p style={{ margin: 0 }}>
              Supporting policy documents can be attached where available for
              your subscription.
            </p>
          </InfoSection>

          <InfoSection
            title="8. Document Vault"
            isOpen={openSection === "8. Document Vault"}
            onToggle={() => toggleSection("8. Document Vault")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Document Vault is intended to keep important EV and vehicle
              documents organised and accessible.
            </p>

            <p style={{ margin: 0 }}>
              Use descriptive filenames so that documents remain easy to
              identify later. Document storage and upload capabilities depend
              on the subscription plan.
            </p>
          </InfoSection>

          <InfoSection
            title="9. Analytics"
            isOpen={openSection === "9. Analytics"}
            onToggle={() => toggleSection("9. Analytics")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Analytics provides a detailed view of your charging activity,
              energy consumption, costs, trends and recent charging sessions.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Analytics uses the charging-session records stored by Charging
              Tracker as its underlying source data.
            </p>

            <p style={{ margin: 0 }}>
              The page also provides reporting and PDF export functionality
              where available.
            </p>
          </InfoSection>

          <InfoSection
            title="10. Settings, Vehicles & Backup"
            isOpen={openSection === "10. Settings, Vehicles & Backup"}
            onToggle={() => toggleSection("10. Settings, Vehicles & Backup")}
          >
            <p style={{ margin: "0 0 12px" }}>
              Settings contains the application's supported configuration
              options.
            </p>

            <ul
              style={{
                margin: "0 0 12px",
                paddingLeft: "20px",
              }}
            >
              <li>Manage vehicle-related settings.</li>
              <li>Select your Primary Vehicle.</li>
              <li>Manage family-related settings where available.</li>
              <li>Review backup options available for your subscription.</li>
              <li>Manage subscription-related features.</li>
            </ul>

            <p style={{ margin: 0 }}>
              Review your settings before entering large amounts of ownership
              data so that the application uses the intended preferences.
            </p>
          </InfoSection>

          <InfoSection
            title="11. User Profile"
            isOpen={openSection === "11. User Profile"}
            onToggle={() => toggleSection("11. User Profile")}
          >
            <p style={{ margin: "0 0 12px" }}>
              User Profile contains your account-related information.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              You can review and update supported profile information and
              manage your password through the profile area.
            </p>

            <p style={{ margin: 0 }}>
              Keep your account information current so that your EV Toolkit
              account remains easy to manage.
            </p>
          </InfoSection>

          <InfoSection
            title="12. Family Sharing"
            isOpen={openSection === "12. Family Sharing"}
            onToggle={() => toggleSection("12. Family Sharing")}
          >
            <p style={{ margin: "0 0 12px" }}>
              EV Toolkit supports family-oriented information sharing where
              available under your subscription.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Shared information can be viewed according to the application's
              family access rules, while ownership protections continue to
              control who can modify or delete protected records.
            </p>

            <p style={{ margin: 0 }}>
              Family-member availability and limits depend on the subscription
              plan.
            </p>
          </InfoSection>

          <InfoSection
            title="13. Subscription Features"
            isOpen={openSection === "13. Subscription Features"}
            onToggle={() => toggleSection("13. Subscription Features")}
          >
            <p style={{ margin: "0 0 12px" }}>
              EV Toolkit provides Free, Premium and Premium Plus access levels.
            </p>

            <p style={{ margin: "0 0 12px" }}>
              Feature availability and record limits depend on the active
              subscription plan.
            </p>

            <p style={{ margin: 0 }}>
              Premium Plus includes additional capabilities such as supported
              cloud attachment storage and related backup features.
            </p>
          </InfoSection>

          <InfoSection
            title="14. Important Tips"
            isOpen={openSection === "14. Important Tips"}
            onToggle={() => toggleSection("14. Important Tips")}
          >
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
              }}
            >
              <li>
                Keep charging records accurate because they are used by
                Analytics.
              </li>
              <li>
                Keep vehicle and insurance information up to date.
              </li>
              <li>
                Use descriptive names for uploaded documents.
              </li>
              <li>
                Review your Primary Vehicle when managing multiple vehicles.
              </li>
              <li>
                Keep exported reports and backups in a secure location.
              </li>
              <li>
                Review recipients carefully before sharing reports, screenshots
                or documents containing personal information.
              </li>
            </ul>
          </InfoSection>
        </div>

        {/* Bottom tip */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px 18px",
            borderRadius: "12px",
            background: "#ffffff",
            border: "1px solid rgba(148,163,184,0.20)",
            color: "#334155",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          💡 <strong>Tip:</strong> You can return to this page anytime from
          the <strong>How to Use</strong> option in the side menu.
        </div>
      </div>
    </div>
  );
}