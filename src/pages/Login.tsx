import { useState } from "react";
import HowToUse from "./HowToUse";
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
      {showHowToUse && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-use-title"
          onClick={() => setShowHowToUse(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(2, 6, 23, 0.68)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 1080,
              height: "min(92vh, 900px)",
              background: "#f5f7fb",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                minHeight: 60,
                padding: "10px 14px 10px 18px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                How to Use EV Toolkit
              </div>

              <button
                type="button"
                onClick={() => setShowHowToUse(false)}
                aria-label="Close How to Use"
                title="Close"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  border: "1px solid #dc2626",
                  borderRadius: 9,
                  background: "#dc2626",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: 22,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                ×
              </button>
            </div>

            <div
              id="how-to-use-title"
              style={{
                width: "100%",
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                boxSizing: "border-box",
              }}
            >
              <HowToUse />
            </div>
          </div>
        </div>
      )}

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
            disabled={loading}
            style={{
              display: "block",
              margin: "12px auto 0",
              border: "none",
              background: "transparent",
              color: "#2563eb",
              cursor: loading ? "not-allowed" : "pointer",
              padding: 0,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            How to Use EV Toolkit
          </button>
        </div>
      </div>
    </div>

    </>
  );
}