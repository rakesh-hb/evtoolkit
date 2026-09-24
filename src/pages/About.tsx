import { useState } from "react";
import UserDetails from "../components/UserDetails";

interface AboutProps {
  onNavigate?: (page: string) => void;
}

export default function About({
  onNavigate,
}: AboutProps) {
  const [showMoreInformation, setShowMoreInformation] =
    useState(false);

  return (
    <>
      <div
        className="welcome"
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            width: "100%",
          }}
        >
          <div>
            <h2>⚡ About EV Toolkit</h2>
            <p>Your personal EV ownership companion.</p>
          </div>

          <UserDetails
            onClick={() => {
              onNavigate?.("profile");
            }}
          />
        </div>
      </div>

      <div className="card">
        <h3>🚗 What is EV Toolkit?</h3>

        <p>
          EV Toolkit is designed to help EV owners manage and track
          their complete EV ownership experience in one place.
        </p>

        <p style={{ marginBottom: 0 }}>
          From charging and service history to tyres, insurance,
          documents, analytics, and ownership planning, EV Toolkit
          keeps important vehicle information organised and easily
          accessible.
        </p>

        <button
          type="button"
          className="saveButton"
          onClick={() => setShowMoreInformation(true)}
          style={{
            marginTop: "16px",
          }}
        >
          📖 More Information
        </button>
      </div>

      <div className="card">
        <h3>⚡ What You Can Manage</h3>

        <ul
          style={{
            lineHeight: "2",
            paddingLeft: "22px",
            marginBottom: 0,
          }}
        >
          <li>🔋 Charging sessions and charging costs</li>
          <li>📍 Charging stations</li>
          <li>🔧 Service and maintenance history</li>
          <li>🛞 Tyre history and warranty information</li>
          <li>🛡️ Insurance policies and policy documents</li>
          <li>📁 Vehicle documents and receipts</li>
          <li>📊 EV ownership analytics</li>
          <li>⚡ EV planning and tracking</li>
          <li>💾 Backup and restore according to your subscription plan</li>
          <li>💳 Premium subscriptions and Premium Plus features</li>
        </ul>
      </div>

      <div className="card">
        <h3>🏢 Business &amp; Legal Information</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr",
            gap: "10px",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <strong>Name</strong>
          <span>Rakesh H B</span>

          <strong>Product / Service</strong>
          <span>EV Toolkit</span>

          <strong>Registered Address</strong>
          <span>
            103, North Winds 2, Jakkur main road, Near The Ledge,
            Yelahanka Old Town, Bengaluru, Karnataka, 560064, India
          </span>
        </div>
      </div>

      <div className="card">
        <h3>💳 Subscription Plans</h3>

        <p>
          EV Toolkit has three subscription levels. Premium is a ₹69
          one-time payment. Premium Plus is a separate subscription
          plan whose pricing and activation will be announced in a
          future release.
        </p>

        <ul
          style={{
            lineHeight: "1.8",
            paddingLeft: "22px",
            marginBottom: 0,
          }}
        >
          <li>
            <strong>Free — ₹0:</strong> up to 20 charging sessions,
            1 insurance record, 2 tyre history records, 3 service
            history records, basic application features, and no
            Document Vault service.
          </li>
          <li>
            <strong>Premium — ₹69 one-time:</strong> unlimited
            records, unlimited charging sessions, up to 4 family
            members, Full Analytics, Analytics PDF export, and
            manual local Backup &amp; Restore.
          </li>
          <li>
            <strong>Premium Plus — subscription, coming in the
            future:</strong> all Premium features plus unlimited
            family members, file uploads, Document Vault, cloud
            storage, cloud backup, automatic backup scheduling,
            and local &amp; cloud backup capabilities.
          </li>
        </ul>

        <p style={{ marginBottom: 0, marginTop: "12px" }}>
          Automatic backup and cloud backup are Premium Plus features.
          Premium users have manual local Backup &amp; Restore only.
          Free users do not have Backup &amp; Restore.
        </p>
      </div>

      <div className="card">
        <h3>🔐 Privacy & Security</h3>

        <p style={{ marginBottom: 0 }}>
          EV Toolkit associates application data with user accounts
          and uses authentication and database-level access controls
          for user-specific records. Record ownership is checked
          before protected update and delete operations.
        </p>
      </div>

      <div className="card">
        <h3>🎯 Our Goal</h3>

        <p style={{ marginBottom: 0 }}>
          EV Toolkit aims to make EV ownership simpler by bringing
          charging, maintenance, costs, documents, insurance, and
          vehicle information together in one easy-to-use application.
        </p>
      </div>

      <div className="card">
        <h3>📱 Application</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <strong>Application</strong>
          <span>EV Toolkit</span>

          <strong>Version</strong>
          <span>1.0</span>

          <strong>Platform</strong>
          <span>Web Application</span>

          <strong>Techsmith</strong>
          <span>Rakesh H B</span>

          <strong>Contact</strong>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <a
              href="mailto:rakesh.hb88@gmail.com?subject=EV%20Toolkit%20Support"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "fit-content",
                padding: "8px 14px",
                borderRadius: "6px",
                background: "#f97316",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              ✉️ Contact Support
            </a>

            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              <div>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:rakesh.hb88@gmail.com"
                  style={{
                    color: "#f97316",
                    textDecoration: "none",
                  }}
                >
                  rakesh.hb88@gmail.com
                </a>
              </div>

              <div>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+919611761243"
                  style={{
                    color: "#f97316",
                    textDecoration: "none",
                  }}
                >
                  +91 96117 61243
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#6b7280",
          fontSize: "12px",
          margin: "24px 0 40px",
        }}
      >
        ⚡ EV Toolkit
        <br />
        Built for a smarter EV ownership experience.
      </div>

      {showMoreInformation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ev-toolkit-information-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(2, 6, 23, 0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMoreInformation(false);
            }
          }}
        >
          <div
            style={{
              width: "min(1100px, 100%)",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#1e293b",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                position: "sticky",
                top: "-24px",
                zIndex: 2,
                background: "#1e293b",
                padding: "24px 0 16px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <h2
                  id="ev-toolkit-information-title"
                  style={{ margin: 0 }}
                >
                  ⚡ EV Toolkit — Complete Information
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#cbd5e1",
                    fontSize: "13px",
                  }}
                >
                  User guide, data reference, security information,
                  reporting and application workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMoreInformation(false)}
                aria-label="Close information"
                title="Close"
                style={{
                  width: "38px",
                  height: "38px",
                  flexShrink: 0,
                  border:
                    "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "9px",
                  background:
                    "rgba(255,255,255,0.06)",
                  color: "#f8fafc",
                  cursor: "pointer",
                  fontSize: "19px",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                lineHeight: 1.65,
                fontSize: "14px",
                color: "#e2e8f0",
              }}
            >
              <InfoSection title="1. Project Overview">
                <p>
                  EV Toolkit is a personal and family-oriented EV
                  ownership management application. It brings
                  charging, vehicle information, planning, maintenance,
                  tyres, insurance, documents and analytics into one
                  application.
                </p>
                <p>
                  The application is intended to provide a single,
                  organised place to maintain EV ownership information
                  and use that information for reporting and analysis.
                </p>
              </InfoSection>

              <InfoSection title="2. Application Areas">
                <ul>
                  <li>
                    <strong>Dashboard:</strong> central overview of
                    the EV ownership information available in the
                    application.
                  </li>
                  <li>
                    <strong>Planner:</strong> record and manage EV
                    ownership/trip planning information.
                  </li>
                  <li>
                    <strong>Tracker:</strong> record charging sessions
                    and their associated vehicle, charger, station,
                    energy, cost and date information.
                  </li>
                  <li>
                    <strong>Analytics:</strong> turns charging-session
                    data into summaries, charts and tables.
                  </li>
                  <li>
                    <strong>Service History:</strong> maintain vehicle
                    service and maintenance records.
                  </li>
                  <li>
                    <strong>Tyre History:</strong> maintain tyre
                    replacement, usage and related warranty information.
                  </li>
                  <li>
                    <strong>Insurance:</strong> maintain insurance
                    policies, dates, financial information, add-ons,
                    agent/broker details and policy documents.
                  </li>
                  <li>
                    <strong>Document Vault:</strong> organise important
                    vehicle documents and receipts.
                  </li>
                  <li>
                    <strong>Settings:</strong> manage application
                    preferences and supported configuration.
                  </li>
                  <li>
                    <strong>User Profile:</strong> view account/user
                    information.
                  </li>
                  <li>
                    <strong>About:</strong> application information and
                    this complete user guide.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="3. Dashboard">
                <p>
                  The Dashboard is the high-level starting point for
                  the application. It is intended to provide a quick
                  view of the EV ownership information rather than
                  replacing the detailed pages.
                </p>
                <p>
                  Use the individual application pages when you need
                  to create, update, review or analyse a particular
                  type of information.
                </p>
              </InfoSection>

              <InfoSection title="4. Planner">
                <p>
                  Planner is used for EV ownership and trip planning
                  information. Enter the information requested by the
                  form, review the calculated or entered values, and
                  save the plan.
                </p>
                <p>
                  Planning information should be kept separate from
                  completed charging-session records: use Tracker for
                  actual charging activity.
                </p>
              </InfoSection>

              <InfoSection title="5. Tracker — Charging Data">
                <p>
                  Tracker is the primary source of charging-session
                  information used by Analytics.
                </p>
                <ul>
                  <li>
                    <strong>Date:</strong> date associated with the
                    charging session.
                  </li>
                  <li>
                    <strong>Vehicle:</strong> EV associated with the
                    session.
                  </li>
                  <li>
                    <strong>Charger / Type:</strong> charger type used
                    for the session.
                  </li>
                  <li>
                    <strong>Station:</strong> charging location or
                    station. Analytics treats an empty station as
                    "Home" when calculating station statistics.
                  </li>
                  <li>
                    <strong>Energy:</strong> energy recorded for the
                    session, displayed in kWh in Analytics.
                  </li>
                  <li>
                    <strong>Cost:</strong> charging cost associated
                    with the session.
                  </li>
                </ul>
                <p>
                  Keep dates, energy and cost values accurate because
                  these values directly affect the Analytics totals,
                  averages, trends and summaries.
                </p>
              </InfoSection>

              <InfoSection title="6. Analytics">
                <p>
                  Analytics reads charging-session records and produces
                  family-wide charging insights from the available
                  data.
                </p>
                <ul>
                  <li>
                    <strong>Total Sessions:</strong> number of charging
                    session records loaded.
                  </li>
                  <li>
                    <strong>Total Energy:</strong> sum of session
                    energy.
                  </li>
                  <li>
                    <strong>Total Spend:</strong> sum of session cost.
                  </li>
                  <li>
                    <strong>Average Cost / Session:</strong> total cost
                    divided by total sessions.
                  </li>
                  <li>
                    <strong>Average Energy / Session:</strong> total
                    energy divided by total sessions.
                  </li>
                  <li>
                    <strong>Monthly Spend Trend:</strong> charging
                    spend grouped by month, with the latest month
                    shown first.
                  </li>
                  <li>
                    <strong>Monthly Energy Trend:</strong> charging
                    energy grouped by month.
                  </li>
                  <li>
                    <strong>Weekly Charging Activity:</strong> charging
                    sessions grouped by day of the week.
                  </li>
                  <li>
                    <strong>Charging Type Distribution:</strong>
                    sessions grouped by charger/type.
                  </li>
                  <li>
                    <strong>Weekly Summary:</strong> session counts for
                    each weekday.
                  </li>
                  <li>
                    <strong>Monthly Summary:</strong> sessions, energy
                    and spend by month.
                  </li>
                  <li>
                    <strong>Vehicle Statistics:</strong> sessions,
                    energy and spend grouped by vehicle.
                  </li>
                  <li>
                    <strong>Charging Station Statistics:</strong>
                    sessions, energy and spend grouped by station.
                  </li>
                  <li>
                    <strong>Yearly Summary:</strong> sessions, energy
                    and spend grouped by year.
                  </li>
                  <li>
                    <strong>Recent Charging Sessions:</strong> charging
                    records sorted newest to oldest.
                  </li>
                </ul>
                <p>
                  The chart expand controls open a larger view of the
                  relevant chart for easier inspection.
                </p>
              </InfoSection>

              <InfoSection title="7. Insurance">
                <p>
                  Insurance stores the information needed to keep EV
                  insurance policies organised.
                </p>
                <ul>
                  <li>Vehicle</li>
                  <li>Insurance company</li>
                  <li>Policy number</li>
                  <li>Policy type</li>
                  <li>Policy start date</li>
                  <li>Policy expiry date</li>
                  <li>Premium</li>
                  <li>IDV</li>
                  <li>Insurance add-ons</li>
                  <li>Agent / Broker</li>
                  <li>Contact number</li>
                  <li>Notes</li>
                  <li>Policy document / attachment</li>
                </ul>
                <p>
                  The policy start date cannot be in the future.
                  Expiry dates may be in the future and must not be
                  earlier than the start date.
                </p>
                <p>
                  Agent / Broker is validated as a name-style text
                  field. Contact Number is a numeric telephone field
                  and accepts digits only.
                </p>
                <p>
                  A user can edit or delete only their own insurance
                  records. Other records are presented as view-only
                  where applicable.
                </p>                <p>
                  Policy document file upload is a Premium Plus
                  feature. Existing saved documents can remain
                  available through the application's supported
                  viewing/download workflow.
                </p>
                <p>
                  Insurance drafts are autosaved to the application's
                  draft storage after inactivity. Attachment content
                  is intentionally excluded from drafts because files
                  can be large; the attachment filename can be retained.
                </p>
              </InfoSection>

              <InfoSection title="8. Service History">
                <p>
                  Service History is used to maintain a chronological
                  record of vehicle servicing and maintenance. Use it
                  for completed maintenance work, service information,
                  costs, dates, mileage and supporting information
                  provided by the page.
                </p>
                <p>
                  Keep service entries accurate and attach supporting
                  documents or receipts where the page provides that
                  capability.
                </p>                <p>
                  Invoice and receipt file uploads on Service History
                  are Premium Plus features. The service record itself
                  remains available according to the subscription
                  limits.
                </p>
              </InfoSection>

              <InfoSection title="9. Tyre History">
                <p>
                  Tyre History is used to maintain tyre-related
                  ownership information, including replacement and
                  warranty details supported by the page.
                </p>
                <p>
                  Use separate records when tyres are replaced or when
                  a significant tyre-related event needs to be retained
                  as part of the vehicle history.
                </p>                <p>
                  Invoice and receipt file uploads on Tyre History are
                  Premium Plus features. Existing saved receipts remain
                  accessible through the application's supported
                  viewing/download workflow.
                </p>
              </InfoSection>

              <InfoSection title="10. Document Vault">
                <p>
                  Document Vault is intended to keep important EV and
                  vehicle documents organised and accessible from the
                  application.
                </p>
                <p>
                  Document Vault and its file-upload functionality are
                  Premium Plus features. Free and Premium users do not
                  have the Document Vault service.
                </p>
                <p>
                  Premium Plus can be used for policy documents,
                  receipts and other supported vehicle-related files.
                  Use descriptive filenames so that documents remain
                  easy to identify later.
                </p>
              </InfoSection>

              <InfoSection title="11. Settings">
                <p>
                  Settings provides the application's supported
                  preferences and configuration. Review the available
                  controls there before entering large amounts of
                  ownership data so that calculations and presentation
                  use the intended preferences.
                </p>
              </InfoSection>

              <InfoSection title="12. User Profile & Family Data">
                <p>
                  User Profile contains account-related user
                  information. The User Details control shown on
                  application pages provides a quick route back to the
                  profile.
                </p>
                <p>
                  EV Toolkit supports family-oriented information
                  sharing. Records that are protected by ownership
                  checks can be modified only by their owner. This
                  separates viewing shared information from permission
                  to modify or delete another user's records.
                </p>                <p>
                  Family access is plan-based. Free users do not have
                  the family-member feature. Premium users can add up
                  to 4 family members. Premium Plus supports unlimited
                  family members.
                </p>
              </InfoSection>

              <InfoSection title="13. Subscription Plans & Feature Access">
                <p>
                  EV Toolkit provides Free, Premium and Premium Plus
                  access levels. The plan shown in User Profile and
                  in the Side Drawer is the user's current active
                  subscription status.
                </p>

                <p>
                  <strong>Free — ₹0:</strong>
                </p>
                <ul>
                  <li>Up to 20 charging sessions.</li>
                  <li>1 insurance record.</li>
                  <li>2 tyre history records.</li>
                  <li>3 service history records.</li>
                  <li>Basic application features.</li>
                  <li>
                    No Document Vault service or document upload
                    capability.
                  </li>
                  <li>
                    No family-member feature.
                  </li>
                  <li>
                    No Backup &amp; Restore option.
                  </li>
                  <li>
                    No automatic backup or cloud backup.
                  </li>
                  <li>
                    Full Analytics and Analytics PDF export are not
                    available.
                  </li>
                </ul>

                <p>
                  <strong>Premium — ₹69 one-time payment:</strong>
                </p>
                <ul>
                  <li>
                    Removes the Free record limits and provides
                    unlimited charging sessions and unlimited
                    applicable ownership records.
                  </li>
                  <li>
                    Family sharing with up to 4 added family members.
                  </li>
                  <li>
                    Full Analytics.
                  </li>
                  <li>
                    Analytics PDF export.
                  </li>
                  <li>
                    Manual local Backup &amp; Restore.
                  </li>
                  <li>
                    No automatic backup schedule.
                  </li>
                  <li>
                    No cloud backup or cloud storage.
                  </li>
                </ul>

                <p>
                  <strong>
                    Premium Plus — separate subscription, coming in
                    the future:
                  </strong>
                </p>
                <ul>
                  <li>
                    Includes all Premium features.
                  </li>
                  <li>
                    Unlimited family members.
                  </li>
                  <li>
                    File uploads and Document Vault functionality.
                  </li>
                  <li>
                    Cloud storage.
                  </li>
                  <li>
                    Cloud backup.
                  </li>
                  <li>
                    Automatic backup scheduling.
                  </li>
                  <li>
                    Manual local Backup &amp; Restore remains
                    available.
                  </li>
                  <li>
                    Backup can use both local and cloud capabilities.
                  </li>
                  <li>
                    Additional Premium Plus features may be added in
                    future releases.
                  </li>
                  <li>
                    Pricing and activation will be announced in a
                    future release.
                  </li>
                </ul>

                <p>
                  The Premium ₹69 purchase is a one-time payment, not
                  a recurring Premium charge. Premium Plus is a
                  separate subscription product and is currently
                  presented as coming in the future.
                </p>                <p>
                  Premium purchases are processed through the
                  application's Razorpay payment integration. The
                  application creates a payment order for the
                  authenticated user and activates Premium only after
                  the payment is verified by the backend. Payment
                  credentials and verification secrets are kept on
                  the backend rather than in the frontend application.
                </p>
              </InfoSection>

              <InfoSection title="14. Autosave & Drafts">
                <p>
                  Several data-entry pages use an autosave draft
                  workflow. Drafts are stored through the application's
                  draft service rather than relying on browser
                  localStorage for persistent user-created application
                  data.
                </p>
                <p>
                  Drafts are intended to protect information entered
                  into a form before the final Save/Update operation.
                  Saving the completed record removes the corresponding
                  draft.
                </p>
                <p>
                  Large attachment content is intentionally excluded
                  from the insurance draft payload; the actual
                  document is handled separately by the attachment
                  workflow.
                </p>
              </InfoSection>

              <InfoSection title="15. PDF Reports">
                <p>
                  Analytics includes reporting tools for exporting
                  analytics information as a PDF report.
                </p>
                <p>
                  The report is designed to turn the Analytics data
                  into a structured, shareable document. Depending on
                  the current report configuration, it can contain
                  report/user information, summary statistics, charging
                  activity, charts, grouped summaries and charging
                  session information.
                </p>
                <p>
                  PDF export should be treated as a report snapshot:
                  changing the underlying charging data later does not
                  retroactively change a PDF that has already been
                  exported.
                </p>
                <p>
                  Because analytics can contain personal and family
                  ownership information, exported reports should be
                  shared only with people who are authorised to receive
                  that information.
                </p>
              </InfoSection>

              <InfoSection title="16. Data Export & Backup">
                <p>
                  Backup access depends on the subscription plan.
                  Free users do not have a Backup &amp; Restore option.
                </p>
                <p>
                  Premium users have manual local Backup &amp; Restore.
                  This creates a local backup that the user can retain
                  and restore through the application. Premium does not
                  include automatic backup or cloud backup.
                </p>
                <p>
                  Premium Plus includes the Premium manual local backup
                  capability and is designed to add automatic backup
                  scheduling, cloud backup and cloud storage, with
                  local and cloud backup capabilities.
                </p>
                <p>
                  Export is different from PDF reporting: a PDF is a
                  human-readable report, while a structured backup or
                  data export is intended to preserve application data.
                </p>
                <p>
                  Always keep exported backups in a secure location
                  because they may contain detailed vehicle,
                  financial, maintenance, insurance and document
                  information.
                </p>
              </InfoSection>

              <InfoSection title="17. Data Validation & Integrity">
                <ul>
                  <li>
                    Required fields are checked before applicable
                    records are saved.
                  </li>
                  <li>
                    Date fields use application validation appropriate
                    to the record.
                  </li>
                  <li>
                    Insurance start dates cannot be future dates.
                  </li>
                  <li>
                    Insurance expiry dates cannot precede start dates.
                  </li>
                  <li>
                    Insurance Agent / Broker input filters unsupported
                    characters.
                  </li>
                  <li>
                    Insurance Contact Number accepts digits only.
                  </li>
                  <li>
                    Ownership is checked before protected insurance
                    update and delete operations.
                  </li>
                  <li>
                    Analytics derives totals and summaries from the
                    charging-session records currently loaded.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="18. Privacy & Security">
                <p>
                  EV Toolkit uses authenticated user accounts and
                  database-level access controls for user-specific
                  records. The application also performs ownership
                  checks in protected workflows.
                </p>
                <p>
                  The security model is designed so that application
                  data is associated with the authenticated user and
                  access to protected records is controlled at the
                  database/application layer rather than relying only
                  on the visual interface.
                </p>
                <p>
                  Persistent user-created form data is stored through
                  the application's backend services. The application
                  does not use browser localStorage as the primary
                  persistent store for user-created records.
                </p>
                <p>
                  Documents and exported reports can contain sensitive
                  ownership information. Protect downloaded files and
                  do not share them outside the intended audience.
                </p>
                <p>
                  Security statements in this page describe the
                  application's implemented security mechanisms. They
                  should not be interpreted as a guarantee that software
                  can never contain a vulnerability. Vulnerability
                  status depends on the current application code,
                  dependencies, backend configuration and deployment
                  environment.
                </p>
              </InfoSection>

              <InfoSection title="19. Recommended Usage Workflow">
                <ol>
                  <li>
                    Sign in and review your User Profile and Settings.
                  </li>
                  <li>
                    Add or verify the vehicles available to the
                    application.
                  </li>
                  <li>
                    Record completed charging sessions in Tracker.
                  </li>
                  <li>
                    Maintain service and tyre history as work is
                    completed.
                  </li>
                  <li>
                    Add current insurance information and upload
                    supporting policy documents.
                  </li>
                  <li>
                    Store important vehicle documents in Document Vault.
                  </li>
                  <li>
                    Use Planner for future ownership/trip planning.
                  </li>
                  <li>
                    Review Analytics regularly to understand charging
                    activity, energy and costs.
                  </li>
                  <li>
                    Export PDF reports or structured data when a
                    portable record or backup is required.
                  </li>
                </ol>
              </InfoSection>

              <InfoSection title="20. Important Data Relationships">
                <ul>
                  <li>
                    Charging records entered in Tracker are the source
                    for the charging analytics.
                  </li>
                  <li>
                    Analytics groups charging data by vehicle, station,
                    charger/type, month, year and weekday.
                  </li>
                  <li>
                    A charging record's energy affects energy totals
                    and averages.
                  </li>
                  <li>
                    A charging record's cost affects spend totals and
                    cost averages.
                  </li>
                  <li>
                    Charging dates determine monthly, yearly and
                    weekday grouping.
                  </li>
                  <li>
                    Deleting or changing a source charging record can
                    therefore change subsequent Analytics results.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="21. Mobile & Responsive Use">
                <p>
                  EV Toolkit is designed to work across desktop and
                  mobile browser layouts. Form controls are sized for
                  smaller screens, including native date controls.
                </p>
                <p>
                  Tables may use horizontal scrolling when their
                  structured columns require more width than a mobile
                  screen can provide.
                </p>
              </InfoSection>

              <InfoSection title="22. Technology & Architecture">
                <p>
                  The application is a React and TypeScript web
                  application built with a Vite-based frontend. It
                  uses Supabase-backed services for authentication,
                  database operations and application data workflows.
                </p>
                <p>
                  The codebase is organised into pages, reusable
                  components, service modules, data definitions and
                  backend-connected workflows. This allows common
                  behaviours such as authentication, user details,
                  draft saving, uploads and reporting to be reused
                  across pages.
                </p>
              </InfoSection>

              <InfoSection title="23. Security & Maintenance Notes">
                <p>
                  Keeping the application secure requires maintaining
                  the frontend, backend policies, storage controls and
                  third-party dependencies. A clean vulnerability scan
                  at one point in time does not establish permanent
                  vulnerability-free status.
                </p>
                <p>
                  For production use, keep dependencies updated,
                  review database access policies, protect backend
                  credentials and secrets, restrict storage access,
                  review authentication configuration and periodically
                  perform dependency and vulnerability scans.
                </p>
              </InfoSection>

              <InfoSection title="24. Support & Application Ownership">
                <p>
                  Application: EV Toolkit
                </p>
                <p>
                  Version: 1.0
                </p>
                <p>
                  Techsmith: Rakesh H B
                </p>
                <p>
                  For application support, use the support contact
                  provided on the main About page.
                </p>
              </InfoSection>

              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "rgba(249,115,22,0.10)",
                  border:
                    "1px solid rgba(249,115,22,0.30)",
                  color: "#fed7aa",
                  fontSize: "13px",
                }}
              >
                <strong>Data protection reminder:</strong>{" "}
                EV Toolkit can contain detailed vehicle, charging,
                financial, insurance, maintenance and document
                information. Review recipients carefully before
                exporting or sharing reports, backups or documents.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="restoreButton"
                onClick={() => setShowMoreInformation(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: "24px",
        paddingBottom: "18px",
        borderBottom:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px",
          color: "#f8fafc",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          color: "#cbd5e1",
        }}
      >
        {children}
      </div>
    </section>
  );
}
