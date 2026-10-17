
import React from "react";

export default function AccountDeletion() {
  const email = "iamrakeshhb@gmail.com";
  const subject = "EV Toolkit Account Deletion Request";
  const body = [
    "Hello EV Toolkit Support,",
    "",
    "I would like to request deletion of my EV Toolkit account and the personal data associated with it.",
    "",
    "Account email address:",
    "",
    "Please let me know if you need any additional information to verify my request.",
    "",
    "Thank you.",
  ].join("\n");

  const emailHref = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      boxSizing: "border-box",
      padding: "32px 16px",
      background: "#0b1020",
      color: "#f3f4f6",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    container: {
      maxWidth: 760,
      margin: "0 auto",
    },
    card: {
      background: "#151c30",
      border: "1px solid #303b55",
      borderRadius: 18,
      padding: "clamp(22px, 5vw, 40px)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.24)",
    },
    eyebrow: {
      color: "#f59e0b",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      margin: "0 0 12px",
    },
    heading: {
      fontSize: "clamp(28px, 5vw, 38px)",
      lineHeight: 1.15,
      margin: "0 0 16px",
      color: "#ffffff",
    },
    paragraph: {
      color: "#cbd5e1",
      fontSize: 16,
      lineHeight: 1.7,
      margin: "0 0 16px",
    },
    sectionHeading: {
      fontSize: 19,
      margin: "28px 0 10px",
      color: "#ffffff",
    },
    list: {
      color: "#cbd5e1",
      fontSize: 15,
      lineHeight: 1.8,
      paddingLeft: 22,
      margin: "0 0 16px",
    },
    button: {
      display: "inline-block",
      boxSizing: "border-box",
      margin: "8px 0 12px",
      padding: "13px 20px",
      borderRadius: 10,
      background: "#f59e0b",
      color: "#111827",
      fontSize: 15,
      fontWeight: 800,
      textDecoration: "none",
      textAlign: "center",
    },
    link: {
      color: "#93c5fd",
      textDecoration: "underline",
      textUnderlineOffset: 3,
    },
    note: {
      marginTop: 20,
      padding: 16,
      borderRadius: 12,
      background: "#202a40",
      border: "1px solid #394763",
      color: "#cbd5e1",
      fontSize: 14,
      lineHeight: 1.65,
    },
    footer: {
      color: "#94a3b8",
      fontSize: 13,
      lineHeight: 1.6,
      marginTop: 22,
      textAlign: "center",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <article style={styles.card}>
          <p style={styles.eyebrow}>EV Toolkit · Account support</p>
          <h1 style={styles.heading}>Request account deletion</h1>
          <p style={styles.paragraph}>
            You can request deletion of your EV Toolkit account and associated
            personal data by contacting our support team using the email link
            below.
          </p>

          <a href={emailHref} style={styles.button}>
            Request account deletion by email
          </a>

          <p style={styles.paragraph}>
            Support email:{" "}
            <a style={styles.link} href={`mailto:${email}`}>
              {email}
            </a>
          </p>

          <h2 style={styles.sectionHeading}>What to include</h2>
          <ul style={styles.list}>
            <li>The email address associated with your EV Toolkit account.</li>
            <li>A clear request to delete your account and associated data.</li>
          </ul>

          <h2 style={styles.sectionHeading}>What happens next?</h2>
          <p style={styles.paragraph}>
            Our support team may contact you to verify account ownership before
            processing the request. We will explain if any information must be
            retained for legal, security, or legitimate business requirements.
          </p>

          <div style={styles.note}>
            <strong>Important:</strong> This page submits a deletion request by
            email; it does not delete an account automatically. In-app account
            deletion is not currently available. Please use the email request
            process above.
          </div>

          <h2 style={styles.sectionHeading}>Privacy and data</h2>
          <p style={styles.paragraph}>
            For more information about how EV Toolkit handles personal data,
            read our{" "}
            <a href="/privacy-policy" style={styles.link}>
              Privacy Policy
            </a>
            .
          </p>
        </article>

        <p style={styles.footer}>EV Toolkit · Account deletion support</p>
      </div>
    </main>
  );
}
