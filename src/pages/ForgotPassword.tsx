import { useState } from "react";
import {
  sendPasswordResetEmail,
} from "../services/authService";

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({
  onBack,
}: ForgotPasswordProps) {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      alert(
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        email.trim()
      );

      setSent(true);
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error
      );

      alert(
        error?.message ||
          "Unable to send password reset email."
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
        {!sent ? (
          <>
            <h2
              style={{
                textAlign: "center",
              }}
            >
              🔐 Forgot Password?
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                lineHeight: 1.5,
              }}
            >
              Enter your email address and
              we'll send you a link to reset
              your password.
            </p>

            <br />

            <label>Email</label>

            <input
              type="email"
              value={email}
              placeholder="name@example.com"
              autoComplete="email"
              disabled={loading}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <br />

            <button
              className="restoreButton"
              style={{
                width: "100%",
              }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            <button
              className="saveButton"
              disabled={loading}
              onClick={onBack}
              style={{
                width: "100%",
                marginTop: 12,
              }}
            >
              Back to Sign In
            </button>
          </>
        ) : (
          <>
            <h2
              style={{
                textAlign: "center",
              }}
            >
              📧 Check Your Email
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              If an account exists for{" "}
              <strong>
                {email}
              </strong>
              , a password reset link has
              been sent.
            </p>

            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              Please also check your spam or
              junk folder.
            </p>

            <br />

            <button
              className="saveButton"
              style={{
                width: "100%",
              }}
              onClick={onBack}
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}