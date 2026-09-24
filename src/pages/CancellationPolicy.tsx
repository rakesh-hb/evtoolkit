import React from "react";

const CancellationPolicy: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        padding: "24px 16px",
        color: "#f5f5f5",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          background: "#111111",
          border: "1px solid #262626",
          borderRadius: 12,
          padding: "28px 32px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, color: "#ffffff" }}>
          Cancellation Policy
        </h1>

        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#999999" }}>
          Last updated: September 23, 2026
        </p>

        <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d4d4d4" }}>
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "0 0 8px" }}>
              1. Overview
            </h2>
            <p>
              This Cancellation Policy applies to paid features and services
              provided through EV Toolkit, operated by{" "}
              <strong>Rocky Tales</strong>.
            </p>
            <p>
              We aim to provide a clear and straightforward cancellation
              process for customers who purchase paid features or services
              through EV Toolkit.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "26px 0 8px" }}>
              2. Cancellation Eligibility
            </h2>
            <p>
              Customers may request cancellation within{" "}
              <strong>10 days of the purchase date</strong>.
            </p>
            <p>
              Cancellation requests should be submitted with sufficient
              information to identify the relevant purchase and account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "26px 0 8px" }}>
              3. How to Request Cancellation
            </h2>
            <p>
              To request cancellation, please contact{" "}
              <strong>Rocky Tales</strong> using the contact details below.
            </p>
            <p>
              Please provide the account details and relevant purchase
              information so that the request can be reviewed.
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:iamrakeshhb@gmail.com?subject=EV%20Toolkit%20Cancellation%20Request"
                style={{ color: "#f97316", textDecoration: "none" }}
              >
                rakesh.hb88@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+919611761243"
                style={{ color: "#f97316", textDecoration: "none" }}
              >
                +91 96117 61243
              </a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "26px 0 8px" }}>
              4. Cancellation and Refund
            </h2>
            <p>
              Where a cancellation is eligible for a refund, the refund will
              be handled in accordance with the{" "}
              <strong>Return & Refund Policy</strong>.
            </p>
            <p>
              Approved refunds will be issued to the{" "}
              <strong>original payment method</strong> used for the purchase.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "26px 0 8px" }}>
              5. Refund Processing
            </h2>
            <p>
              Once an eligible cancellation and refund request has been
              approved, the refund will be initiated to the original payment
              method.
            </p>
            <p>
              The time required for the refunded amount to appear in the
              customer's account may depend on the payment provider and the
              customer's bank or financial institution.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#ffffff", margin: "26px 0 8px" }}>
              6. Contact
            </h2>
            <p>
              For questions regarding cancellation or this policy, please use:
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:iamrakeshhb@gmail.com"
                style={{ color: "#f97316", textDecoration: "none" }}
              >
                iamrakeshhb@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+919611761243"
                style={{ color: "#f97316", textDecoration: "none" }}
              >
                +91 96117 61243
              </a>
            </p>
          </section>

          <section
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #2a2a2a",
            }}
          >
            
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
