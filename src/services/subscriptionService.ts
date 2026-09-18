import { supabase } from "../lib/supabase";

/*
 * =========================================================
 * EV TOOLKIT SUBSCRIPTION SERVICE
 * =========================================================
 *
 * Premium is currently a ₹49 one-time purchase.
 *
 * IMPORTANT:
 * - This service reads the user's entitlement from Supabase.
 * - Selecting Premium during registration does NOT activate it.
 * - Premium becomes active only when the subscription record
 *   is successfully verified/created by the future payment flow.
 * - These client-side helpers are for UI/UX checks.
 *   Database/RLS enforcement will be added separately.
 */

export type SubscriptionPlan =
  | "free"
  | "premium";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "failed"
  | "cancelled";

export interface UserSubscription {
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: "INR";
  purchase_type: "one_time";
  purchased_at: string | null;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
}

export const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free",
    price: 0,
    currency: "INR",
    purchaseType: "free",
  },
  premium: {
    name: "Premium",
    price: 49,
    currency: "INR",
    purchaseType: "one_time",
  },
} as const;

export const FREE_LIMITS = {
  insurance: 1,
  documents: 3,
  tyreHistory: 2,
  serviceHistory: 3,
  chargingSessions: 20,
} as const;

/*
 * Premium has no numeric ceiling for the record types
 * covered by the Premium plan.
 */
export const PREMIUM_LIMITS = {
  insurance: null,
  documents: null,
  tyreHistory: null,
  serviceHistory: null,
  chargingSessions: null,
} as const;

/*
 * =========================================================
 * GET CURRENT SUBSCRIPTION
 * =========================================================
 */

export async function getCurrentSubscription(): Promise<UserSubscription | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      [
        "user_id",
        "plan",
        "status",
        "amount",
        "currency",
        "purchase_type",
        "purchased_at",
        "payment_reference",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserSubscription | null;
}

/*
 * =========================================================
 * CHECK PREMIUM STATUS
 * =========================================================
 *
 * Uses the database function created in Step 1.
 */

export async function isPremiumUser(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } =
    await supabase.rpc("is_premium_user");

  if (error) {
    throw error;
  }

  return data === true;
}

/*
 * =========================================================
 * GET CURRENT PLAN
 * =========================================================
 */

export async function getCurrentPlan(): Promise<SubscriptionPlan> {
  const premium = await isPremiumUser();

  return premium
    ? "premium"
    : "free";
}

/*
 * =========================================================
 * GENERIC RECORD LIMIT CHECK
 * =========================================================
 */

export function canAddWithinLimit(
  currentCount: number,
  limit: number | null
): boolean {
  if (limit === null) {
    return true;
  }

  return currentCount < limit;
}

/*
 * =========================================================
 * FREE-PLAN LIMIT HELPERS
 * =========================================================
 */

export function canAddInsurance(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentCount,
    plan === "premium"
      ? PREMIUM_LIMITS.insurance
      : FREE_LIMITS.insurance
  );
}

export function canAddDocument(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentCount,
    plan === "premium"
      ? PREMIUM_LIMITS.documents
      : FREE_LIMITS.documents
  );
}

export function canAddTyreHistory(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentCount,
    plan === "premium"
      ? PREMIUM_LIMITS.tyreHistory
      : FREE_LIMITS.tyreHistory
  );
}

export function canAddServiceHistory(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentCount,
    plan === "premium"
      ? PREMIUM_LIMITS.serviceHistory
      : FREE_LIMITS.serviceHistory
  );
}

export function canAddChargingSession(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentCount,
    plan === "premium"
      ? PREMIUM_LIMITS.chargingSessions
      : FREE_LIMITS.chargingSessions
  );
}

/*
 * =========================================================
 * PREMIUM FEATURE HELPERS
 * ========================================================= */

export function canUseFamily(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium";
}

export function canUseAutoBackup(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium";
}

export function canUseAnalytics(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium";
}

export function canExportAnalyticsPdf(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium";
}

/*
 * =========================================================
 * USER-FRIENDLY LIMIT MESSAGE
 * =========================================================
 */

export function getUpgradeMessage(
  featureName: string,
  limit?: number
): string {
  if (typeof limit === "number") {
    return `${featureName} is limited to ${limit} on the Free plan. Upgrade to Premium for ₹49 one-time to unlock more.`;
  }

  return `${featureName} is available with Premium for ₹49 one-time.`;
}
