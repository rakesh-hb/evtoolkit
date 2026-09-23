import React from "react";

const RefundPolicy: React.FC = () => {
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
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 26,
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Return & Refund Policy
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            fontSize: 13,
            color: "#999999",
          }}
        >
          Last updated: September 23, 2026
        </p>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#d4d4d4",
          }}
        >
          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "0 0 8px",
              }}
            >
              1. Overview
            </h2>

            <p>
              This Return & Refund Policy applies to purchases made for paid
              features and services provided through EV Toolkit, operated by{" "}
              <strong>Rocky Tales</strong>.
            </p>

            <p>
              We aim to provide a clear and straightforward refund process for
              eligible purchases.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "26px 0 8px",
              }}
            >
              2. Refund Eligibility
            </h2>

            <p>
              Customers may request a refund within{" "}
              <strong>10 days of the purchase date</strong>.
            </p>

            <p>
              Refund requests should be submitted with sufficient information
              to identify the relevant purchase and account.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "26px 0 8px",
              }}
            >
              3. Refund Method
            </h2>

            <p>
              Approved refunds will be issued to the{" "}
              <strong>original payment method</strong> used for the purchase.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "26px 0 8px",
              }}
            >
              4. Refund Processing
            </h2>

            <p>
              Once a refund request has been reviewed and approved, the refund
              will be initiated to the original payment method.
            </p>

            <p>
              The time required for the refunded amount to appear in the
              customer's account may depend on the payment provider and the
              customer's bank or financial institution.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "26px 0 8px",
              }}
            >
              5. How to Request a Refund
            </h2>

            <p>
              To request a refund, please contact Rocky Tales using the contact
              details provided on the EV Toolkit website and provide the
              relevant account and purchase information.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                margin: "26px 0 8px",
              }}
            >
              6. Contact
            </h2>

            <p>
              For questions regarding refunds or this policy, please contact
              Rocky Tales through the contact details provided on the EV Toolkit
              website.
            </p>
          </section>

          <section
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #2a2a2a",
            }}
          >
            <p style={{ margin: "4px 0" }}>
              <strong>Trade Name:</strong> Rocky Tales
            </p>

            <p style={{ margin: "4px 0" }}>
              <strong>Product/Service:</strong> EV Toolkit
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;