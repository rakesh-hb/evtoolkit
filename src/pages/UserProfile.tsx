import {
    useEffect,
    useState,
  } from "react";
  
  import { supabase } from "../lib/supabase";
  
  import {
    changePassword,
    updateProfile,
  } from "../services/authService";
  
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
  
    useEffect(() => {
      loadProfile();
    }, []);
  
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
          "same_password"
        ) {
          alert(
            "The new password cannot be the same as your current password."
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
  
    return (
      <>
        <div className="welcome">
          <h2>👤 User Profile</h2>
  
          <p>
            Manage your personal information
            and account password.
          </p>
        </div>
  
        {/* Profile Information */}
  
        <div className="card">
          <h3>Personal Information</h3>
  
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
                  color: "#6b7280",
                  marginTop: 6,
                }}
              >
                Email is managed by your
                authentication account.
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
  
        {/* Change Password */}
  
        <div className="card">
          <h3>Change Password</h3>
  
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Enter your current password before
            choosing a new password.
          </p>
  
          <div className="formGrid">
            <div>
              <label>
                Current Password *
              </label>
  
              <input
                type="password"
                value={currentPassword}
                autoComplete="current-password"
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
                value={newPassword}
                autoComplete="new-password"
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
                value={confirmPassword}
                autoComplete="new-password"
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
            Minimum 8 characters. Your Supabase
            Auth password-security settings may
            require additional complexity.
          </p>
  
          <br />
  
          <button
            className="saveButton"
            disabled={changingPassword}
            onClick={
              handleChangePassword
            }
          >
            {changingPassword
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </div>
      </>
    );
  }