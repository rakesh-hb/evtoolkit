import {
    useEffect,
    useState,
  } from "react";
  
  import { supabase } from "../lib/supabase";
  
  interface ResetPasswordProps {
    onComplete: () => void;
  }
  
  export default function ResetPassword({
    onComplete,
  }: ResetPasswordProps) {
    const [password, setPassword] =
      useState("");
  
    const [confirmPassword, setConfirmPassword] =
      useState("");
  
    const [loading, setLoading] =
      useState(false);
  
    const [ready, setReady] =
      useState(false);
  
    const [error, setError] =
      useState("");
  
    useEffect(() => {
      let mounted = true;
  
      async function checkSession() {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();
  
        if (!mounted) return;
  
        if (session) {
          setReady(true);
        }
      }
  
      checkSession();
  
      const {
        data: { subscription },
      } =
        supabase.auth.onAuthStateChange(
          (event, session) => {
            if (
              event ===
                "PASSWORD_RECOVERY" &&
              session
            ) {
              setReady(true);
              setError("");
            }
          }
        );
  
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }, []);
  
    async function handleResetPassword() {
      setError("");
  
      if (!password) {
        setError(
          "Please enter a new password."
        );
        return;
      }
  
      if (password.length < 8) {
        setError(
          "Password must be at least 8 characters."
        );
        return;
      }
  
      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }
  
      try {
        setLoading(true);
  
        const { error } =
          await supabase.auth.updateUser({
            password,
          });
  
        if (error) {
          throw error;
        }
  
        alert(
          "Password updated successfully."
        );
  
        await supabase.auth.signOut();
  
        onComplete();
      } catch (error: any) {
        console.error(
          "Password reset error:",
          error
        );
  
        setError(
          error?.message ||
            "Failed to update password."
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
            }}
          >
            🔐 Reset Password
          </h2>
  
          {!ready && !error && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Verifying your reset link...
            </p>
          )}
  
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border:
                  "1px solid #fecaca",
                color: "#b91c1c",
                padding: 12,
                borderRadius: 6,
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
  
          {ready && (
            <>
              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.5,
                }}
              >
                Enter a new password for your
                EV Toolkit account.
              </p>
  
              <label>
                New Password *
              </label>
  
              <input
                type="password"
                value={password}
                placeholder="New password"
                autoComplete="new-password"
                disabled={loading}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
  
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
  
              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Password must be at least 8
                characters. Your Supabase Auth
                password-security settings may
                impose stronger requirements.
              </p>
  
              <br />
  
              <button
                className="saveButton"
                style={{
                  width: "100%",
                }}
                disabled={loading}
                onClick={
                  handleResetPassword
                }
              >
                {loading
                  ? "Updating Password..."
                  : "Update Password"}
              </button>
            </>
          )}
  
          {error && (
            <button
              type="button"
              onClick={onComplete}
              style={{
                width: "100%",
                marginTop: 12,
              }}
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    );
  }