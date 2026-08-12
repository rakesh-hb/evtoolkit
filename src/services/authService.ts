import { supabase } from "../lib/supabase";

/*
 * =========================================================
 * SIGN IN
 * =========================================================
 */

export async function signIn(
  email: string,
  password: string
) {
  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

  if (error) throw error;

  /*
   * Establish the password-history baseline.
   *
   * This is intentionally called only AFTER Supabase
   * successfully authenticates the user.
   */
  if (data.session) {
    try {
      await supabase.functions.invoke(
        "password-history",
        {
          body: {
            action:
              "record_login",
            password,
          },
        }
      );
    } catch (historyError) {
      /*
       * Do not prevent a valid user from logging in if
       * password-history recording temporarily fails.
       *
       * The error is logged so it can be diagnosed.
       */
      console.error(
        "Password history initialization error:",
        historyError
      );
    }
  }

  return data;
}

/*
 * =========================================================
 * CREATE ACCOUNT
 * =========================================================
 */

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  const {
    data,
    error,
  } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name:
            firstName,
          last_name:
            lastName,
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
 * =========================================================
 * SIGN OUT
 * =========================================================
 */

export async function signOut() {
  const {
    error,
  } =
    await supabase.auth.signOut();

  if (error) throw error;
}

/*
 * =========================================================
 * CHANGE PASSWORD
 * =========================================================
 */

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke(
      "password-history",
      {
        body: {
          action:
            "change_password",
          currentPassword,
          newPassword,
        },
      }
    );

  if (error) {
    throw error;
  }

  if (data?.error) {
    const passwordError =
      new Error(data.error);

    (
      passwordError as Error & {
        code?: string;
      }
    ).code =
      data.code;

    throw passwordError;
  }

  return data;
}

/*
 * =========================================================
 * RESET PASSWORD
 * =========================================================
 */

export async function resetPassword(
  newPassword: string
) {
  const {
    data,
    error,
  } =
    await supabase.functions.invoke(
      "password-history",
      {
        body: {
          action:
            "reset_password",
          newPassword,
        },
      }
    );

  if (error) {
    throw error;
  }

  if (data?.error) {
    const passwordError =
      new Error(data.error);

    (
      passwordError as Error & {
        code?: string;
      }
    ).code =
      data.code;

    throw passwordError;
  }

  return data;
}

/*
 * =========================================================
 * UPDATE PROFILE
 * =========================================================
 */

export async function updateProfile(
  firstName: string,
  lastName: string,
  phone: string
) {
  const {
    data,
    error,
  } =
    await supabase.auth.updateUser({
      data: {
        first_name:
          firstName,
        last_name:
          lastName,
        phone,
        full_name:
          `${firstName} ${lastName}`.trim(),
      },
    });

  if (error) throw error;

  return data;
}

/*
 * =========================================================
 * SEND FORGOT-PASSWORD EMAIL
 * =========================================================
 */

export async function sendPasswordResetEmail(
  email: string
) {
  const redirectTo =
  "https://evtoolkit.rockytales.workers.dev/reset-password";

  const {
    data,
    error,
  } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      }
    );

  if (error) throw error;

  return data;
}