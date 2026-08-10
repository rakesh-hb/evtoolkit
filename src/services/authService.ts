import { supabase } from "../lib/supabase";

/*
 * Sign in
 */
export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
}

/*
 * Create account
 *
 * First name, last name and phone are
 * stored in Supabase Auth user metadata.
 */
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          full_name:
            `${firstName} ${lastName}`.trim(),
        },
      },
    });

  if (error) throw error;

  return data;
}

/*
 * Sign out
 */
export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) throw error;
}

/*
 * Change password for an authenticated user.
 *
 * current_password requires the corresponding
 * Supabase Auth password-security setting.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const { data, error } =
    await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });

  if (error) throw error;

  return data;
}

/*
 * Update profile information
 */
export async function updateProfile(
  firstName: string,
  lastName: string,
  phone: string
) {
  const { data, error } =
    await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
        full_name:
          `${firstName} ${lastName}`.trim(),
      },
    });

  if (error) throw error;

  return data;
}

/*
 * Send forgot-password email
 */
export async function sendPasswordResetEmail(
  email: string
) {
  const redirectTo =
    `${window.location.origin}/reset-password`;

  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      }
    );

  if (error) throw error;

  return data;
}