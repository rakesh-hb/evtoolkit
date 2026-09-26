import { useState } from "react";
import UserDetails from "../components/UserDetails";
import { supabase } from "../lib/supabase";
import { getCurrentPlan } from "../services/subscriptionService";

interface AboutProps {
  onNavigate?: (page: string) => void;
}

export default function About({
  onNavigate,
}: AboutProps) {
  const [showMoreInformation, setShowMoreInformation] =
    useState(false);

  async function handleContactSupport() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      const metadata = user?.user_metadata ?? {};
      const firstName = String(metadata.first_name ?? "").trim();
      const lastName = String(metadata.last_name ?? "").trim();
      const fullName =
        `${firstName} ${lastName}`.trim() || "Not provided";
      const email = user?.email || "Not provided";
      const phone = String(metadata.phone ?? "").trim() || "Not provided";
      const userId = user?.id || "Not available";
      const accountCreated =
        user?.created_at
          ? new Date(user.created_at).toLocaleString()
          : "Not available";
      const lastSignIn =
        user?.last_sign_in_at
          ? new Date(user.last_sign_in_at).toLocaleString()
          : "Not available";

      let subscriptionPlan = "Not available";

      try {
        subscriptionPlan = await getCurrentPlan();
      } catch (planError) {
        console.warn(
          "Unable to load subscription plan for support email:",
          planError
        );
      }

      const browserDetails =
        typeof navigator !== "undefined"
          ? navigator.userAgent
          : "Not available";


      const subject = `EV Toolkit Support - ${fullName}`;

      const body = [
        "Hello EV Toolkit Support,",
        "",
        "I need help with EV Toolkit.",
        "",
        "USER DETAILS",
        "----------------------------------------",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `User ID: ${userId}`,
        `Subscription Plan: ${subscriptionPlan}`,
        `Account Created: ${accountCreated}`,
        `Last Sign-In: ${lastSignIn}`,
        "",
        "APPLICATION / ENVIRONMENT",
        "----------------------------------------",
        "Current Page: About",
        `Browser / Device: ${browserDetails}`,
        "",
        "SUPPORT MESSAGE",
        "----------------------------------------",
        "Please describe the issue or request here:",
        "",
        "",
        "",
        "",
        "Thank you.",
      ].join("\n");

      const mailtoUrl =
        `mailto:iamrakeshhb@gmail.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;
    } catch (error) {
      console.error(
        "Failed to prepare support email:",
        error
      );

      window.location.href =
        "mailto:iamrakeshhb@gmail.com?subject=EV%20Toolkit%20Support";
    }
  }

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
          <li>💳 Premium and Premium Plus subscription features</li>
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

          <strong>Trade Name</strong>
          <span>Rocky Tales</span>

          <strong>Product / Service</strong>
          <span>EV Toolkit</span>

          <strong>Registered Address</strong>
          <span>
            Bengaluru, Karnataka, India
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

          <strong>Trade Name</strong>
          <span>Rocky Tales</span>

          <strong>Version</strong>
          <span>1.0</span>

          <strong>Platform</strong>
          <span>Web Application / Capacitor Android support</span>

          <strong>Technology</strong>
          <span>React · TypeScript · Vite · Supabase</span>

          <strong>Name</strong>
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
            <button
              type="button"
              onClick={() => {
                void handleContactSupport();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "fit-content",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: "#f97316",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              ✉️ Contact Support
            </button>

            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              <div>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:iamrakeshhb@gmail.com"
                  style={{
                    color: "#f97316",
                    textDecoration: "none",
                  }}
                >
                  iamrakeshhb@gmail.com
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
                    Open Settings and set your single Primary Vehicle. EV
                    Toolkit currently keeps one saved Primary Vehicle per
                    user. If you need to change it, clear the current
                    Primary Vehicle first and then select the replacement.
                    Other pages may temporarily use another vehicle for a
                    specific operation, but that does not change the saved
                    Primary Vehicle.
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
                  <li>
                    The saved Primary Vehicle is a user preference used as
                    the default vehicle context across vehicle-dependent
                    pages. Changing or clearing it does not rewrite the
                    historical vehicle value stored on existing records.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="21. Calculation Reference — Charging & Analytics">
                <p>
                  Analytics calculations are derived from the charging-session
                  records currently loaded by the application. The values
                  below describe the calculation model used for the displayed
                  totals and averages.
                </p>
                <ul>
                  <li>
                    <strong>Total Sessions:</strong> count of the loaded
                    charging-session records.
                  </li>
                  <li>
                    <strong>Total Energy:</strong> sum of the recorded
                    session energy values, displayed as kWh.
                  </li>
                  <li>
                    <strong>Total Cost / Spend:</strong> sum of the recorded
                    charging-session cost values.
                  </li>
                  <li>
                    <strong>Average Cost / Session:</strong> Total Cost ÷
                    Total Sessions, when sessions are greater than zero.
                  </li>
                  <li>
                    <strong>Average Energy / Session:</strong> Total Energy ÷
                    Total Sessions, when sessions are greater than zero.
                  </li>
                  <li>
                    <strong>Monthly Spend:</strong> session costs are grouped
                    by the session date's month and summed.
                  </li>
                  <li>
                    <strong>Monthly Energy:</strong> session energy values are
                    grouped by month and summed.
                  </li>
                  <li>
                    <strong>Weekly Activity:</strong> sessions are grouped by
                    weekday to show charging activity across the week.
                  </li>
                  <li>
                    <strong>Charging Type Distribution:</strong> sessions are
                    grouped by their recorded charger/type.
                  </li>
                  <li>
                    <strong>Vehicle Statistics:</strong> sessions, energy and
                    cost are grouped by the vehicle recorded on each session.
                  </li>
                  <li>
                    <strong>Station Statistics:</strong> sessions, energy and
                    cost are grouped by charging station. A blank station is
                    treated as <strong>Home</strong> for the relevant station
                    statistics.
                  </li>
                  <li>
                    <strong>Yearly Summary:</strong> sessions, energy and
                    spend are grouped by calendar year.
                  </li>
                </ul>
                <p>
                  Analytics is therefore a calculation layer over recorded
                  charging data. If a source session is corrected, added or
                  removed, the corresponding totals, charts, tables and
                  summaries can change.
                </p>
              </InfoSection>

              <InfoSection title="22. Approximate Petrol / Diesel Comparison & CO₂">
                <p>
                  EV Toolkit also provides an <strong>approximate</strong>
                  comparison between the recorded EV charging activity and
                  estimated equivalent petrol and diesel vehicle use. These
                  values are estimates for comparison and are not measurements
                  of fuel actually purchased or consumed.
                </p>
                <p>
                  The current benchmark assumptions are:
                </p>
                <ul>
                  <li><strong>EV efficiency:</strong> 6.0 km/kWh</li>
                  <li><strong>Petrol efficiency:</strong> 15.0 km/L</li>
                  <li><strong>Diesel efficiency:</strong> 20.0 km/L</li>
                  <li><strong>Petrol benchmark price:</strong> ₹110/L</li>
                  <li><strong>Diesel benchmark price:</strong> ₹100/L</li>
                  <li><strong>Petrol tailpipe CO₂ factor:</strong> 2.32 kg/L</li>
                  <li><strong>Diesel tailpipe CO₂ factor:</strong> 2.70 kg/L</li>
                </ul>
                <p>
                  The calculations are:
                </p>
                <ul>
                  <li>
                    <strong>Estimated distance:</strong> Total EV Energy ×
                    6.0 km/kWh.
                  </li>
                  <li>
                    <strong>Equivalent petrol litres:</strong> Estimated
                    Distance ÷ 15.0 km/L.
                  </li>
                  <li>
                    <strong>Equivalent diesel litres:</strong> Estimated
                    Distance ÷ 20.0 km/L.
                  </li>
                  <li>
                    <strong>Approx. petrol cost:</strong> Equivalent petrol
                    litres × ₹110/L.
                  </li>
                  <li>
                    <strong>Approx. diesel cost:</strong> Equivalent diesel
                    litres × ₹100/L.
                  </li>
                  <li>
                    <strong>Approx. savings vs petrol:</strong> Approx. petrol
                    cost − recorded EV charging cost.
                  </li>
                  <li>
                    <strong>Approx. savings vs diesel:</strong> Approx. diesel
                    cost − recorded EV charging cost.
                  </li>
                  <li>
                    <strong>Approx. petrol CO₂ avoided:</strong> Equivalent
                    petrol litres × 2.32 kg/L.
                  </li>
                  <li>
                    <strong>Approx. diesel CO₂ avoided:</strong> Equivalent
                    diesel litres × 2.70 kg/L.
                  </li>
                  <li>
                    <strong>Approx. CO₂ avoided:</strong> the average of the
                    estimated petrol and diesel CO₂ avoided values.
                  </li>
                </ul>
                <p>
                  These comparison values use fixed benchmark assumptions so
                  that the same charging data produces a consistent estimate.
                  Actual fuel economy, fuel prices, driving conditions, vehicle
                  size, charging losses and electricity-generation emissions
                  can differ. The current comparison is therefore an
                  approximate tailpipe-oriented comparison and does not claim
                  to represent a full lifecycle emissions analysis.
                </p>
                <p>
                  A negative estimated saving means the benchmark comparison
                  cost is below the recorded EV charging cost for the same
                  estimated distance; the application should be understood as
                  reporting the mathematical result of the benchmark model,
                  not as a guarantee of real-world savings.
                </p>
              </InfoSection>

              <InfoSection title="23. Primary Vehicle & Vehicle Context">
                <p>
                  EV Toolkit uses a single saved <strong>Primary Vehicle</strong>
                  as the user's main vehicle context. This is a preference,
                  not a replacement for the vehicle value stored in historical
                  records.
                </p>
                <ul>
                  <li>
                    Every user can have one saved Primary Vehicle.
                  </li>
                  <li>
                    The Primary Vehicle is selected and cleared from Settings.
                  </li>
                  <li>
                    A replacement Primary Vehicle requires the current Primary
                    Vehicle to be cleared first.
                  </li>
                  <li>
                    Vehicle-dependent pages use the Primary Vehicle as their
                    default or reset context where supported.
                  </li>
                  <li>
                    A page may still allow a temporary vehicle selection for a
                    specific operation. That temporary selection does not
                    change the saved Primary Vehicle.
                  </li>
                  <li>
                    The Dashboard can display the Primary Vehicle and its
                    vehicle-specific charging summary separately from
                    family-wide charging totals.
                  </li>
                  <li>
                    A Dashboard Vehicle Alias, when configured, changes only
                    the name shown in the Dashboard Primary Vehicle section.
                    It does not rename the actual vehicle record elsewhere in
                    EV Toolkit.
                  </li>
                  <li>
                    Dashboard aliases are stored separately from the vehicle
                    reference and are case-insensitively unique after
                    trimming.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="24. End-to-End Application Data Flow">
                <p>
                  The application follows an end-to-end flow from
                  authentication and vehicle context through data entry,
                  persistence, calculation, reporting and backup.
                </p>
                <ol>
                  <li>
                    <strong>Authentication:</strong> the user signs in through
                    the application's authenticated account flow.
                  </li>
                  <li>
                    <strong>User context:</strong> account information and
                    subscription status determine the features available to
                    the user.
                  </li>
                  <li>
                    <strong>Vehicle context:</strong> the user selects a
                    Primary Vehicle in Settings. Vehicle-dependent pages can
                    use it as their default context.
                  </li>
                  <li>
                    <strong>Data entry:</strong> charging, service, tyre,
                    insurance, documents and planning information are entered
                    through their respective pages.
                  </li>
                  <li>
                    <strong>Draft protection:</strong> supported forms use
                    autosaved drafts so unfinished entries can survive before
                    final submission.
                  </li>
                  <li>
                    <strong>Persistence:</strong> completed user-created
                    records are stored through the application's backend
                    services and database.
                  </li>
                  <li>
                    <strong>Access control:</strong> authenticated access,
                    database policies and ownership checks protect applicable
                    user records.
                  </li>
                  <li>
                    <strong>Analytics:</strong> charging-session data is
                    aggregated into totals, averages, trends, distributions
                    and grouped summaries.
                  </li>
                  <li>
                    <strong>Approximate comparison:</strong> Analytics can
                    derive estimated distance, petrol/diesel equivalent cost
                    and approximate CO₂ avoided using the documented benchmark
                    assumptions.
                  </li>
                  <li>
                    <strong>Reporting:</strong> Analytics report data can be
                    exported into a PDF snapshot containing the relevant
                    report information and analytics data.
                  </li>
                  <li>
                    <strong>Backup:</strong> supported plans can preserve
                    application data through the available local and/or cloud
                    backup mechanisms.
                  </li>
                </ol>
              </InfoSection>

              <InfoSection title="25. Data Ownership, Editing & Deletion">
                <p>
                  EV Toolkit separates the data shown to a user from the
                  permissions used to modify or delete it. Where ownership
                  checks apply, a user can update or delete records they own,
                  while shared records may be visible without granting the
                  same modification rights.
                </p>
                <ul>
                  <li>
                    Editing a record changes the stored source record and can
                    change downstream calculations that depend on it.
                  </li>
                  <li>
                    Deleting a source charging record can change Analytics
                    totals and report results.
                  </li>
                  <li>
                    Clearing the Primary Vehicle clears the saved vehicle
                    preference; it does not delete historical charging,
                    service, tyre, insurance or document records.
                  </li>
                  <li>
                    Clearing a Dashboard Vehicle Alias removes only that
                    Dashboard display alias; it does not delete the vehicle.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="26. Charging Stations & Charging Types">
                <p>
                  Charging station and charger/type information is maintained
                  separately from the core charging-session measurements so
                  that charging activity can be analysed by location and
                  charging method.
                </p>
                <ul>
                  <li>
                    A charging session can reference the charger/type used.
                  </li>
                  <li>
                    A charging session can reference a charging station.
                  </li>
                  <li>
                    Tracker supports charging-station management as part of
                    the charging workflow.
                  </li>
                  <li>
                    Analytics uses these values for charging-type and station
                    statistics.
                  </li>
                  <li>
                    Missing station information is treated as Home for the
                    applicable station statistics.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="27. Files, Attachments & Document Handling">
                <p>
                  EV Toolkit distinguishes structured application records from
                  file attachments. Structured information is used directly
                  by the relevant pages and calculations, while supported
                  plans can store files such as policy documents, invoices and
                  receipts.
                </p>
                <ul>
                  <li>
                    Insurance can reference policy documents.
                  </li>
                  <li>
                    Service History can use invoice and receipt uploads where
                    supported by the subscription.
                  </li>
                  <li>
                    Tyre History can use invoice and receipt uploads where
                    supported by the subscription.
                  </li>
                  <li>
                    Document Vault is intended for supported vehicle-related
                    documents and receipts.
                  </li>
                  <li>
                    Large attachment content is not copied into supported
                    form drafts; the file is handled by the attachment
                    workflow.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="28. Backup vs PDF Reporting">
                <p>
                  These are different functions and should not be confused.
                </p>
                <ul>
                  <li>
                    <strong>PDF report:</strong> a human-readable snapshot of
                    Analytics information at the time it is generated.
                  </li>
                  <li>
                    <strong>Structured backup:</strong> intended to preserve
                    application data so it can be retained and restored
                    through the supported backup workflow.
                  </li>
                  <li>
                    A PDF does not become updated automatically when the
                    underlying database records later change.
                  </li>
                  <li>
                    Backups and reports may contain sensitive information and
                    should be stored and shared securely.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="29. Frontend, Backend & Project Technology">
                <p>
                  EV Toolkit is implemented as a modern TypeScript web
                  application with a React frontend and Vite build system.
                  The current project stack includes:
                </p>
                <ul>
                  <li><strong>React:</strong> 19</li>
                  <li><strong>TypeScript:</strong> 6</li>
                  <li><strong>Vite:</strong> 8</li>
                  <li><strong>Backend platform:</strong> Supabase</li>
                  <li>
                    <strong>Mobile packaging:</strong> Capacitor Android
                    support is part of the project.
                  </li>
                </ul>
                <p>
                  The frontend is organised into application pages, reusable
                  components, contexts, service modules, vehicle data,
                  authentication, subscription handling, draft handling,
                  reporting and backend-connected workflows.
                </p>
              </InfoSection>

              <InfoSection title="30. Authentication & Subscription Architecture">
                <p>
                  Authentication identifies the current user and supplies the
                  account context used by protected application workflows.
                  Subscription state controls access to plan-specific
                  features.
                </p>
                <p>
                  Premium payment uses the application's Razorpay integration.
                  The frontend does not independently grant Premium access:
                  the payment order is associated with the authenticated user
                  and Premium activation occurs after backend verification.
                </p>
                <p>
                  Payment credentials and verification secrets are kept on the
                  backend rather than embedded as frontend secrets.
                </p>
              </InfoSection>

              <InfoSection title="31. Supabase & Database Security Model">
                <p>
                  Supabase provides the backend authentication and database
                  layer. Protected data is associated with authenticated
                  users, and database-level Row Level Security (RLS) is used
                  for applicable user-owned records.
                </p>
                <ul>
                  <li>
                    Authentication establishes the user's identity.
                  </li>
                  <li>
                    RLS policies restrict database access according to the
                    configured ownership rules.
                  </li>
                  <li>
                    Application-level ownership checks provide an additional
                    protection layer in protected update and delete workflows.
                  </li>
                  <li>
                    Client-side UI visibility is not intended to be the only
                    security boundary.
                  </li>
                  <li>
                    Backend credentials and payment verification secrets are
                    not intended to be exposed in the browser application.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="32. Current Feature Set — End-to-End Summary">
                <p>
                  In practical terms, EV Toolkit covers the complete
                  ownership workflow from maintaining the user's vehicle
                  context through recording real charging activity,
                  maintaining ownership records and producing analytics.
                </p>
                <ul>
                  <li>Dashboard overview and Primary Vehicle summary.</li>
                  <li>Single Primary Vehicle configuration in Settings.</li>
                  <li>Charging Tracker and charging-station management.</li>
                  <li>EV ownership and trip planning.</li>
                  <li>Service and maintenance history.</li>
                  <li>Tyre replacement and warranty history.</li>
                  <li>Insurance policy and related information.</li>
                  <li>Vehicle documents and Document Vault.</li>
                  <li>Analytics charts, tables and summaries.</li>
                  <li>Approximate petrol/diesel cost comparison.</li>
                  <li>Approximate CO₂ avoided comparison.</li>
                  <li>Analytics PDF reporting.</li>
                  <li>Autosaved form drafts on supported pages.</li>
                  <li>Manual local backup/restore for Premium.</li>
                  <li>Cloud/automatic backup capabilities planned for Premium Plus.</li>
                  <li>Family-oriented data access according to subscription.</li>
                  <li>User Profile and account management.</li>
                  <li>Responsive desktop/mobile web use.</li>
                  <li>Support contact workflow with account/environment details.</li>
                </ul>
              </InfoSection>

              <InfoSection title="33. What EV Toolkit Does Not Claim">
                <p>
                  The application is a management and analysis tool. Its
                  calculations should be interpreted according to the source
                  data and documented assumptions.
                </p>
                <ul>
                  <li>
                    Approximate petrol/diesel savings are not a guarantee of
                    actual money saved.
                  </li>
                  <li>
                    Approximate CO₂ avoided is not a complete lifecycle
                    emissions assessment.
                  </li>
                  <li>
                    Analytics cannot correct inaccurate source charging data;
                    inaccurate input produces inaccurate derived results.
                  </li>
                  <li>
                    A PDF report is not a live view of the database after it
                    has been exported.
                  </li>
                  <li>
                    Security controls reduce unauthorised access risk but do
                    not constitute a guarantee that software can never contain
                    a vulnerability.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="34. Recommended End-to-End Usage">
                <ol>
                  <li>Sign in and confirm your account information.</li>
                  <li>
                    Open Settings and select your Primary Vehicle.
                  </li>
                  <li>
                    Optionally configure a Dashboard Vehicle Alias if you want
                    a custom display name on the Dashboard.
                  </li>
                  <li>
                    Record actual charging sessions in Tracker, including
                    accurate date, energy, cost, vehicle, charger/type and
                    station information.
                  </li>
                  <li>
                    Maintain service and tyre records whenever maintenance or
                    replacement occurs.
                  </li>
                  <li>
                    Keep insurance information and supported policy documents
                    current.
                  </li>
                  <li>
                    Store important vehicle documents in Document Vault when
                    the feature is available on the subscription.
                  </li>
                  <li>
                    Use Planner for future trips or ownership planning rather
                    than treating planned activity as completed charging
                    activity.
                  </li>
                  <li>
                    Review Analytics to understand sessions, energy, costs,
                    trends and charging patterns.
                  </li>
                  <li>
                    Review the approximate petrol/diesel comparison as a
                    benchmark rather than as a measured fuel-cost or emissions
                    result.
                  </li>
                  <li>
                    Export an Analytics PDF when a shareable report snapshot is
                    required.
                  </li>
                  <li>
                    Use the backup facilities available on the current
                    subscription and keep exported backups in a secure
                    location.
                  </li>
                </ol>
              </InfoSection>

              <InfoSection title="35. Project Status & Version">
                <p>
                  <strong>Application:</strong> EV Toolkit
                </p>
                <p>
                  <strong>Version:</strong> 1.0
                </p>
                <p>
                  <strong>Platform:</strong> Web Application with Capacitor
                  Android support in the project.
                </p>
                <p>
                  The About page is intended to document the implemented
                  application behaviour, feature boundaries, data flow and
                  calculation assumptions so that users can understand what
                  EV Toolkit is doing with their information.
                </p>
              </InfoSection>

              <InfoSection title="36. Maintenance & Future Development">
                <p>
                  EV Toolkit is designed as an evolving application. Feature
                  availability, subscription entitlements, backup capabilities,
                  report layouts, calculation assumptions and supported
                  integrations may change in future releases.
                </p>
                <p>
                  When a calculation or feature changes, the relevant
                  application workflow and documentation should be updated
                  together so that the displayed result and its explanation
                  remain consistent.
                </p>
              </InfoSection>

              <InfoSection title="37. Support & Troubleshooting Workflow">
                <ol>
                  <li>
                    Confirm the affected page and the action that produced
                    the problem.
                  </li>
                  <li>
                    Confirm the current account and subscription status.
                  </li>
                  <li>
                    Confirm the Primary Vehicle and relevant source records.
                  </li>
                  <li>
                    Recheck the input values used by the affected calculation.
                  </li>
                  <li>
                    For Analytics issues, compare the source Tracker records
                    with the displayed totals and summaries.
                  </li>
                  <li>
                    Use Contact Support from the About page when assistance is
                    required. The support workflow can include account,
                    subscription, browser/device and application context to
                    help diagnose the issue.
                  </li>
                </ol>
              </InfoSection>

              <InfoSection title="38. Important Privacy Reminder">
                <p>
                  EV Toolkit can contain detailed vehicle, charging,
                  financial, maintenance, insurance, family and document
                  information. Review recipients carefully before sharing
                  screenshots, PDF reports, backups or exported files.
                </p>
              </InfoSection>

              <InfoSection title="39. Documentation Principle">
                <p>
                  The purpose of this information page is transparency:
                  users should be able to understand what each major part of
                  EV Toolkit does, where the underlying data comes from, how
                  the main analytics values are calculated, what is
                  approximate, what is plan-dependent and how information
                  moves through the application from entry to storage,
                  analysis, reporting and backup.
                </p>
              </InfoSection>

              <InfoSection title="40. Quick Reference">
                <ul>
                  <li>
                    <strong>Source for charging analytics:</strong> Tracker
                    charging-session records.
                  </li>
                  <li>
                    <strong>Primary vehicle:</strong> one saved vehicle
                    preference per user.
                  </li>
                  <li>
                    <strong>Analytics:</strong> totals, averages, trends,
                    distributions, grouped summaries and recent sessions.
                  </li>
                  <li>
                    <strong>Approximate comparison:</strong> benchmark petrol
                    and diesel cost and tailpipe CO₂ estimates.
                  </li>
                  <li>
                    <strong>PDF:</strong> human-readable Analytics snapshot.
                  </li>
                  <li>
                    <strong>Backup:</strong> plan-dependent data preservation
                    mechanism.
                  </li>
                  <li>
                    <strong>Persistent application data:</strong> backend
                    services/database rather than browser localStorage as the
                    primary record store.
                  </li>
                  <li>
                    <strong>Security:</strong> authentication, RLS and
                    applicable ownership checks.
                  </li>
                </ul>
              </InfoSection>

              <InfoSection title="41. Final End-to-End Picture">
                <p>
                  <strong>Sign in → select Primary Vehicle → enter and
                  maintain ownership data → save records → protect unfinished
                  forms with drafts where supported → analyse charging
                  records → calculate approximate comparisons → generate PDF
                  reports → back up supported data → securely retain or share
                  the resulting information.</strong>
                </p>
                <p>
                  Each stage has a different purpose. Tracker records actual
                  charging activity; Analytics calculates summaries from those
                  records; the approximate petrol/diesel section applies its
                  documented benchmark model; PDF reporting captures the
                  current Analytics state; and backup is intended to preserve
                  application data rather than merely create a visual report.
                </p>
              </InfoSection>

              <InfoSection title="42. Documentation Scope">
                <p>
                  This guide documents the application's current intended
                  behaviour and the calculation assumptions implemented in
                  EV Toolkit. It is not a substitute for the application's
                  database schema, source code, legal terms, payment-provider
                  terms, privacy policy or deployment configuration.
                </p>
              </InfoSection>

              <InfoSection title="43. Change Awareness">
                <p>
                  If the application is upgraded, a feature is added or a
                  calculation assumption changes, this page should be reviewed
                  so that users are not relying on outdated instructions.
                  In particular, analytics assumptions, subscription
                  entitlements, backup functionality and document-upload
                  capabilities should remain aligned with the deployed
                  application.
                </p>
              </InfoSection>

              <InfoSection title="44. Application Philosophy">
                <p>
                  EV Toolkit is intended to keep EV ownership information in
                  one organised place while separating source records from
                  derived analysis. The application does not treat an
                  estimate as a measured fact: approximate comparisons are
                  labelled as approximate, while recorded charging values are
                  presented as the source data used by the analytics layer.
                </p>
              </InfoSection>

              <InfoSection title="45. End of Complete Information">
                <p>
                  This completes the current EV Toolkit project information
                  reference: what the application contains, how its major
                  pages work together, how charging analytics are calculated,
                  how the approximate petrol/diesel and CO₂ comparison is
                  derived, how vehicle context works, how data is persisted
                  and protected, how subscriptions affect features, and how
                  reporting and backup fit into the overall workflow.
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
