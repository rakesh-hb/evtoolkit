import { useState } from "react";
import {
  signIn,
  signUp,
  resendConfirmationEmail,
} from "../services/authService";

interface LoginProps {
  onForgotPassword: () => void;
}

type RegistrationPlan = "free" | "premium";

export default function Login({
  onForgotPassword,
}: LoginProps) {
  const [registerMode, setRegisterMode] =
    useState(false);

  const [showHowToUse, setShowHowToUse] =
    useState(false);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [selectedPlan, setSelectedPlan] =
    useState<RegistrationPlan>("free");

  const [loading, setLoading] =
    useState(false);

  const [resendingConfirmation, setResendingConfirmation] =
    useState(false);

  const [showResendConfirmation, setShowResendConfirmation] =
    useState(false);

  const [confirmationMessage, setConfirmationMessage] =
    useState("");

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedPlan("free");
    setShowResendConfirmation(false);
    setConfirmationMessage("");
  }

  function switchMode(
    mode: boolean
  ) {
    resetForm();
    setRegisterMode(mode);
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      alert(
        "Please enter your email and password."
      );
      return;
    }

    setShowResendConfirmation(false);
    setConfirmationMessage("");

    try {
      setLoading(true);

      await signIn(
        email.trim(),
        password
      );
    } catch (error: any) {
      console.error(
        "Login error:",
        error
      );

      const errorCode =
        String(error?.code || "").toLowerCase();

      const errorMessage =
        String(error?.message || "").toLowerCase();

      const emailNotConfirmed =
        errorCode === "email_not_confirmed" ||
        errorMessage.includes("email not confirmed") ||
        errorMessage.includes("email not verified");

      if (emailNotConfirmed) {
        setShowResendConfirmation(true);
        setConfirmationMessage(
          "Please confirm your email address before signing in."
        );
      } else {
        alert(
          error?.message ||
            "Unable to sign in."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendConfirmation() {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setResendingConfirmation(true);
      setConfirmationMessage("");

      await resendConfirmationEmail(
        email.trim()
      );

      setConfirmationMessage(
        "Confirmation email sent. Please check your inbox and spam folder."
      );
    } catch (error: any) {
      console.error(
        "Resend confirmation email error:",
        error
      );

      alert(
        error?.message ||
          "Unable to resend the confirmation email."
      );
    } finally {
      setResendingConfirmation(false);
    }
  }

  async function handleRegister() {
    if (!firstName.trim()) {
      alert("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      alert("Please enter your last name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      alert(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert(
        "Password must contain at least one digit."
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      alert(
        "Password must contain at least one symbol."
      );
      return;
    }

    if (!confirmPassword) {
      alert(
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signUp(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
        phone.trim()
      );

      /*
       * Plan selection is currently informational only.
       * Plan selection is informational only.
       * Premium access is NOT granted by selecting Premium.
       * Premium Plus is displayed as Coming in the Future and cannot
       * be selected during registration.
       */
      if (result.session) {
        alert(
          selectedPlan === "premium"
            ? "Account created successfully.\n\nPremium is selected. Complete the ₹69 one-time payment to activate Premium features."
            : "Account created successfully."
        );
      } else {
        alert(
          selectedPlan === "premium"
            ? "Account created successfully.\n\nPlease check your email to confirm your account. If you do not see the email in your inbox, please check your spam or junk folder too. After confirmation, complete the ₹69 one-time payment to activate Premium features."
            : "Account created successfully.\n\nPlease check your email to confirm your account before signing in. If you do not see the email in your inbox, please check your spam or junk folder too."
        );
      }

      switchMode(false);
    } catch (error: any) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        error?.message ||
          "Failed to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: 20,
      }}
    >
      <div
        className="card"
        style={{
          width: 420,
          maxWidth: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          ⚡ EV Toolkit
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: 24,
          }}
        >
          {registerMode
            ? "Create your EV Toolkit account"
            : "Sign in to continue"}
        </p>

        {registerMode && (
          <>
            <label>First Name *</label>

            <input
              type="text"
              value={firstName}
              placeholder="First name"
              autoComplete="given-name"
              disabled={loading}
              onChange={(e) =>
                setFirstName(
                  e.target.value
                )
              }
            />

            <label>Last Name *</label>

            <input
              type="text"
              value={lastName}
              placeholder="Last name"
              autoComplete="family-name"
              disabled={loading}
              onChange={(e) =>
                setLastName(
                  e.target.value
                )
              }
            />

            <label>Phone Number *</label>

            <input
              type="tel"
              value={phone}
              placeholder="Phone number"
              autoComplete="tel"
              disabled={loading}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: 18,
                }}
              >
                Choose Your Plan
              </h3>

              <p
                style={{
                  margin: "0 0 14px",
                  color: "#6b7280",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Choose the plan that fits your EV
                ownership needs. Premium Plus is
                shown as Coming in the Future.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr",
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setSelectedPlan("free")
                  }
                  style={{
                    textAlign: "left",
                    padding: 14,
                    border:
                      selectedPlan === "free"
                        ? "2px solid #16a34a"
                        : "1px solid #d1d5db",
                    borderRadius: 12,
                    background:
                      selectedPlan === "free"
                        ? "#86efac"
                        : "#ffffff",
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    Free
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      marginTop: 4,
                    }}
                  >
                    ₹0
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    • 20 charging sessions
                    <br />
                    • 1 insurance
                    <br />
                    • 2 tyre history records
                    <br />
                    • 3 service history records
                    <br />
                    • Basic application features
                  </div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setSelectedPlan("premium")
                  }
                  style={{
                    textAlign: "left",
                    padding: 14,
                    border:
                      selectedPlan === "premium"
                        ? "2px solid #16a34a"
                        : "1px solid #d1d5db",
                    borderRadius: 12,
                    background:
                      selectedPlan === "premium"
                        ? "#86efac"
                        : "#ffffff",
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    Premium
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      marginTop: 4,
                    }}
                  >
                    ₹69
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#374151",
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    One-time payment
                    <br />
                    • Can add up to 4 family members
                    <br />
                    • Manual backup & restore
                    <br />
                    • Unlimited records
                    <br />
                    • Unlimited charging sessions
                    <br />
                    • Full Analytics
                    <br />
                    • Analytics PDF export
                  </div>
                </button>

                <div
                  style={{
                    textAlign: "left",
                    padding: 14,
                    border: "2px solid #dc2626",
                    borderRadius: 12,
                    background: "#ffffff",
                    color: "#1e3a8a",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      Premium Plus
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: "#2563eb",
                        color: "#ffffff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      COMING IN THE FUTURE
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#dc2626",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    CURRENTLY UNAVAILABLE
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      marginTop: 6,
                    }}
                  >
                    Subscription
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    • All Premium features
                    <br />
                    • Unlimited family members
                    <br />
                    • File uploads
                    <br />
                    • Cloud storage
                    <br />
                    • Automatic backup schedule
                    <br />
                    • Local & cloud backup
                    <br />
                    • Additional Premium Plus features
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Pricing and activation will be announced in a future release.
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "#f9fafb",
                  color: "#6b7280",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {selectedPlan === "premium"
                  ? "Premium access is activated only after the ₹69 one-time payment is successfully verified."
                  : "Free access is available without payment. Premium Plus is coming in the future."}
              </div>
            </div>
          </>
        )}

        <label>Email *</label>

        <input
          type="email"
          value={email}
          placeholder="name@example.com"
          autoComplete="email"
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
            setShowResendConfirmation(false);
            setConfirmationMessage("");
          }}
        />

        <label>Password *</label>

        <input
          type="password"
          value={password}
          placeholder="Password"
          autoComplete={
            registerMode
              ? "new-password"
              : "current-password"
          }
          disabled={loading}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !registerMode
            ) {
              handleLogin();
            }
          }}
        />

        {!registerMode &&
          showResendConfirmation && (
            <div
              style={{
                marginTop: 10,
                marginBottom: 16,
                padding: "12px 14px",
                borderRadius: 8,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
              }}
            >
              <div
                style={{
                  color: "#9a3412",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {confirmationMessage}
              </div>

              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={
                  loading ||
                  resendingConfirmation
                }
                style={{
                  marginTop: 10,
                  border: "none",
                  background: "transparent",
                  color: "#2563eb",
                  cursor:
                    loading ||
                    resendingConfirmation
                      ? "not-allowed"
                      : "pointer",
                  padding: 0,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {resendingConfirmation
                  ? "Sending..."
                  : "Resend confirmation email"}
              </button>
            </div>
          )}

        {registerMode && (
          <>
            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 6,
              }}
            >
              Minimum 8 characters, including at least
              one lowercase letter, one uppercase letter,
              one digit, and one symbol.
            </p>

            <label>
              Confirm Password *
            </label>

            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={loading}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />
          </>
        )}

        {!registerMode && (
          <div
            style={{
              textAlign: "right",
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer",
                padding: 0,
                fontSize: 14,
              }}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          className="saveButton"
          style={{
            width: "100%",
          }}
          disabled={loading}
          onClick={
            registerMode
              ? handleRegister
              : handleLogin
          }
        >
          {loading
            ? registerMode
              ? "Creating Account..."
              : "Signing In..."
            : registerMode
              ? "Create Account"
              : "Sign In"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              switchMode(
                !registerMode
              )
            }
            style={{
              border: "none",
              background: "transparent",
              color: "#2563eb",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: 14,
            }}
          >
            {registerMode
              ? "Already have an account? Sign In"
              : "New to EV Toolkit? Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setShowHowToUse(true)}
            style={{
              display: "block",
              margin: "12px auto 0",
              border: "none",
              background: "transparent",
              color: "#2563eb",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            How to Use EV Toolkit
          </button>
        </div>
      </div>
    </div>

    {showHowToUse && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-use-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowHowToUse(false)}
        >
          <div
            className="card"
            style={{
              width: 760,
              maxWidth: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
              position: "relative",
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close How to Use guide"
              onClick={() => setShowHowToUse(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 34,
                height: 34,
                border: "none",
                borderRadius: 8,
                background: "#dc2626",
                color: "#ffffff",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ×
            </button>

            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(90vh - 48px)",
                paddingRight: 8,
              }}
            >
              <h2
                id="how-to-use-title"
                style={{
                  marginTop: 0,
                  marginBottom: 6,
                  paddingRight: 44,
                }}
              >
                ⚡ How to Use EV Toolkit
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginTop: 0,
                  marginBottom: 22,
                }}
              >
                A quick guide to the main features of EV Toolkit.
              </p>

              <p>
                EV Toolkit is a complete EV ownership companion designed to help you manage your EV information from one place — from charging and planning to service history, tyres, insurance, documents and analytics.
              </p>

              <h3>1. Getting Started</h3>
              <p>EV Toolkit is designed to help you manage your EV ownership information from one place.</p>
              <p>After signing in, start by checking your vehicle information and Primary Vehicle selection in Settings. The selected Primary Vehicle is used by supported parts of the application when displaying vehicle-related information.</p>
              <p>You can use the Dashboard as your starting point and then move between Charging Tracker, Planner, Analytics and the vehicle record sections from the application menu.</p>

              <h3>2. Dashboard</h3>
              <p>The Dashboard provides a quick overview of your EV information and recent activity.</p>
              <p>Review your selected vehicle, view charging activity and key totals, review recent activity, and use the available dashboard cards to navigate to related features.</p>

              <h3>3. Charging Tracker</h3>
              <p>Charging Tracker is used to record your charging sessions.</p>
              <p>Enter the information available for a charging session, such as date, energy, cost and other supported details.</p>
              <p>Saved charging sessions are used by Analytics to calculate charging activity, energy and cost information.</p>
              <p>Keep charging records accurate because Analytics depends on the underlying Tracker data.</p>

              <h3>4. Planner</h3>
              <p>Planner helps you estimate charging and trip-related information using the inputs available in the application.</p>
              <p>Use the available vehicle, battery, charging and trip inputs to estimate energy requirements, charging time, range and charging cost where supported.</p>

              <h3>5. Service History</h3>
              <p>Service History is used to maintain a chronological record of vehicle servicing and maintenance.</p>
              <p>Use it to record completed maintenance work, service information, dates, mileage, costs and other supported details.</p>
              <p>Supporting receipts or documents can be attached where the feature is available for your subscription.</p>

              <h3>6. Tyre History</h3>
              <p>Tyre History is used to maintain tyre-related records.</p>
              <p>Record tyre replacements and other significant tyre-related information supported by the page. Keep separate records when a new tyre set or significant tyre-related event needs to be retained.</p>

              <h3>7. Insurance</h3>
              <p>Insurance is used to maintain your vehicle insurance information.</p>
              <p>You can record supported information such as the insurance company, policy number, policy type, dates, premium, IDV, add-ons, agent details and notes.</p>
              <p>Supporting policy documents can be attached where available for your subscription.</p>

              <h3>8. Document Vault</h3>
              <p>Document Vault is intended to keep important EV and vehicle documents organised and accessible.</p>
              <p>Use descriptive filenames so that documents remain easy to identify later. Document storage and upload capabilities depend on the subscription plan.</p>

              <h3>9. Analytics</h3>
              <p>Analytics provides a detailed view of your charging activity, energy consumption, costs, trends and recent charging sessions.</p>
              <p>Analytics uses the charging-session records stored by Charging Tracker as its underlying source data.</p>
              <p>The page also provides reporting and PDF export functionality where available.</p>

              <h3>10. Settings, Vehicles &amp; Backup</h3>
              <p>Settings contains the application's supported configuration options.</p>
              <p>Manage vehicle-related settings; select your Primary Vehicle; manage family-related settings where available; review backup options available for your subscription; and manage subscription-related features.</p>
              <p>Review your settings before entering large amounts of ownership data so that the application uses the intended preferences.</p>

              <h3>11. User Profile</h3>
              <p>User Profile contains your account-related information.</p>
              <p>You can review and update supported profile information and manage your password through the profile area.</p>
              <p>Keep your account information current so that your EV Toolkit account remains easy to manage.</p>

              <h3>12. Family Sharing</h3>
              <p>EV Toolkit supports family-oriented information sharing where available under your subscription.</p>
              <p>Shared information can be viewed according to the application's family access rules, while ownership protections continue to control who can modify or delete protected records.</p>
              <p>Family-member availability and limits depend on the subscription plan.</p>

              <h3>13. Subscription Features</h3>
              <p>EV Toolkit provides Free, Premium and Premium Plus access levels.</p>
              <p>Feature availability and record limits depend on the active subscription plan.</p>
              <p>Premium Plus includes additional capabilities such as supported cloud attachment storage and related backup features.</p>

              <h3>14. Important Tips</h3>
              <ul style={{ lineHeight: 1.7, paddingLeft: 22 }}>
                <li>Keep charging records accurate because they are used by Analytics.</li>
                <li>Keep vehicle and insurance information up to date.</li>
                <li>Use descriptive names for uploaded documents.</li>
                <li>Review your Primary Vehicle when managing multiple vehicles.</li>
                <li>Keep exported reports and backups in a secure location.</li>
                <li>Review recipients carefully before sharing reports, screenshots or documents containing personal information.</li>
              </ul>

              <div
                style={{
                  marginTop: 20,
                  padding: 14,
                  borderRadius: 10,
                  background: "#f3f4f6",
                  color: "#4b5563",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Tip: You can return to the How to Use page anytime from the How to Use option in the side menu after signing in.
              </div>
            </div>
          </div>
        </div>
    )}
    </>
  );
}
