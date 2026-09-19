import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import {
  changePassword,
  updateProfile,
} from "../services/authService";

import UserDetails from "../components/UserDetails";

import {
  getCurrentPlan,
  type SubscriptionPlan,
} from "../services/subscriptionService";

export default function UserProfile() {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");

  const [loadingSubscriptionPlan, setLoadingSubscriptionPlan] =
    useState(true);

  useEffect(() => {
    void loadProfile();
  }, []);

  useEffect(() => {
    void loadSubscriptionPlan();
  }, []);

  async function loadSubscriptionPlan() {
    setLoadingSubscriptionPlan(true);

    try {
      const plan = await getCurrentPlan();
      setSubscriptionPlan(plan);
    } catch (error) {
      console.error(
        "Failed to load subscription plan:",
        error
      );
      setSubscriptionPlan("free");
    } finally {
      setLoadingSubscriptionPlan(false);
    }
  }

  async function loadProfile() {
    try {
      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (error) throw error;

      if (!user) {
        throw new Error(
          "User not authenticated."
        );
      }

      setFirstName(
        user.user_metadata
          ?.first_name || ""
      );

      setLastName(
        user.user_metadata
          ?.last_name || ""
      );

      setPhone(
        user.user_metadata
          ?.phone || ""
      );

      setEmail(
        user.email || ""
      );
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      alert(
        "Failed to load profile."
      );
    }
  }

  async function handleSaveProfile() {
    if (!firstName.trim()) {
      alert(
        "First name is required."
      );
      return;
    }

    if (!lastName.trim()) {
      alert(
        "Last name is required."
      );
      return;
    }

    if (!phone.trim()) {
      alert(
        "Phone number is required."
      );
      return;
    }

    try {
      setSavingProfile(true);

      await updateProfile(
        firstName.trim(),
        lastName.trim(),
        phone.trim()
      );

      alert(
        "Profile updated successfully."
      );
    } catch (error: any) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        error?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword) {
      alert(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      alert(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      alert(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      newPassword ===
      currentPassword
    ) {
      alert(
        "Your new password must be different from your current password."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      alert(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(
        currentPassword,
        newPassword
      );

      alert(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(
        "Password change error:",
        error
      );

      if (
        error?.code ===
        "password_reused"
      ) {
        alert(
          "This password has been used before. Please choose a different password."
        );
      } else if (
        error?.code ===
        "invalid_current_password"
      ) {
        alert(
          "The current password is incorrect."
        );
      } else {
        alert(
          error?.message ||
            "Failed to change password."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to log out."
      );
    }
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: 52,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
        }}
      >
        <UserDetails />
      </div>

      <div className="welcome">
        <h2>👤 User Profile</h2>

        <p>
          Manage your personal information
          and account password.
        </p>
      </div>

      <div className="card">
        <h3>
          Personal Information
        </h3>

        <div className="formGrid">
          <div>
            <label>
              First Name *
            </label>

            <input
              value={firstName}
              onChange={(e) =>
                setFirstName(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label>
              Last Name *
            </label>

            <input
              value={lastName}
              onChange={(e) =>
                setLastName(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              disabled
            />

            <p
              style={{
                fontSize: 12,
                color:
                  "#6b7280",
                marginTop: 6,
              }}
            >
              Email is managed by
              your authentication
              account.
            </p>
          </div>
        </div>

        <br />

        <button
          className="saveButton"
          disabled={savingProfile}
          onClick={
            handleSaveProfile
          }
        >
          {savingProfile
            ? "Saving..."
            : "Save Profile"}
        </button>
      </div>

      <div className="card">
        <h3>
          ⭐ Subscription
        </h3>

        {loadingSubscriptionPlan ? (
          <p
            style={{
              marginTop: 10,
              color: "#6b7280",
            }}
          >
            Loading subscription...
          </p>
        ) : (
          <div
            style={{
              marginTop: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              background:
                subscriptionPlan === "premium_plus"
                  ? "#eff6ff"
                  : subscriptionPlan === "premium"
                    ? "#fef2f2"
                    : "#f0fdf4",
              border:
                subscriptionPlan === "premium_plus"
                  ? "1px solid #93c5fd"
                  : subscriptionPlan === "premium"
                    ? "1px solid #fecaca"
                    : "1px solid #86efac",
              color:
                subscriptionPlan === "premium_plus"
                  ? "#1d4ed8"
                  : subscriptionPlan === "premium"
                    ? "#b91c1c"
                    : "#166534",
              fontWeight: 700,
            }}
          >
            <span>
              {subscriptionPlan === "premium_plus"
                ? "Premium Plus"
                : subscriptionPlan === "premium"
                  ? "Premium"
                  : "Free"}
            </span>

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              Active
            </span>
          </div>
        )}

        <p
          style={{
            marginTop: 10,
            fontSize: 13,
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          Your current EV Toolkit subscription plan.
        </p>
      </div>

      <div className="card">
        <h3>
          Change Password
        </h3>

        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Your new password must be at
          least 8 characters and cannot
          be a password you have used
          previously.
        </p>

        <div className="formGrid">
          <div>
            <label>
              Current Password *
            </label>

            <input
              type="password"
              value={
                currentPassword
              }
              autoComplete="current-password"
              disabled={
                changingPassword
              }
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label>
              New Password *
            </label>

            <input
              type="password"
              value={
                newPassword
              }
              autoComplete="new-password"
              disabled={
                changingPassword
              }
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label>
              Confirm New Password *
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              autoComplete="new-password"
              disabled={
                changingPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 8,
          }}
        >
          Previously used passwords
          cannot be reused.
        </p>

        <br />

        <button
          className="saveButton"
          disabled={
            changingPassword
          }
          onClick={
            handleChangePassword
          }
        >
          {changingPassword
            ? "Changing Password..."
            : "Change Password"}
        </button>
      </div>

      <div
        className="card"
        style={{
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => void handleLogout()}
          style={{
            display: "block",
            width: "100%",
            background: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}