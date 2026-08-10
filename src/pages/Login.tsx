import { useState } from "react";
import {
  signIn,
  signUp,
} from "../services/authService";

interface LoginProps {
  onForgotPassword: () => void;
}

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

  const [loading, setLoading] =
    useState(false);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
       * If email confirmation is enabled,
       * Supabase returns a user but no active session.
       */
      if (result.session) {
        alert(
          "Account created successfully."
        );
      } else {
        alert(
          "Account created successfully.\n\n" +
            "Please check your email to confirm your account before signing in."
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