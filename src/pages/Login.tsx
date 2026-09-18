import { useState } from "react";
import {
  signIn,
  signUp,
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

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSelectedPlan("free");
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

      alert(
        error?.message ||
          "Unable to sign in."
      );
    } finally {
      setLoading(false);
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
       * Premium Plus is displayed as Coming Soon and cannot
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
            ? "Account created successfully.\n\nPlease check your email to confirm your account. After confirmation, complete the ₹69 one-time payment to activate Premium features."
            : "Account created successfully.\n\nPlease check your email to confirm your account before signing in."
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
                shown as Coming Soon.
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
                    • 3 documents
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
                        ? "2px solid #dc2626"
                        : "1px solid #d1d5db",
                    borderRadius: 12,
                    background:
                      selectedPlan === "premium"
                        ? "#fca5a5"
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
                    • Family members
                    <br />
                    • Automatic backup
                    <br />
                    • More records
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
                    border: "2px solid #2563eb",
                    borderRadius: 12,
                    background: "#bfdbfe",
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
                      COMING SOON
                    </span>
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      marginTop: 8,
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
                    • File uploads
                    <br />
                    • Cloud storage
                    <br />
                    • Cloud backup
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
                  : "Free access is available without payment. Premium Plus is coming soon."}
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
          onChange={(e) =>
            setEmail(e.target.value)
          }
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

        {registerMode && (
          <>
            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 6,
              }}
            >
              Minimum 8 characters. Supabase
              password-security settings may
              require additional characters.
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
        </div>
      </div>
    </div>
  );
}
