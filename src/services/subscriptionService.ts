import { supabase } from "../lib/supabase";

/*
 * =========================================================
 * EV TOOLKIT SUBSCRIPTION SERVICE
 * =========================================================
 *
 * Premium is currently a ₹69 one-time purchase.
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
  | "premium"
  | "premium_plus";

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
  purchase_type: "one_time" | "subscription";
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
    price: 69,
    currency: "INR",
    purchaseType: "one_time",
  },
  premium_plus: {
    name: "Premium Plus",
    price: null,
    currency: "INR",
    purchaseType: "subscription",
    comingSoon: true,
  },
} as const;

export const FREE_LIMITS = {
  insurance: 1,
  documents: 0,
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
 * Family member limits exclude the family owner.
 * Premium allows up to 4 added family members.
 * Premium Plus allows unlimited added family members.
 */
export const FAMILY_LIMITS = {
  free: 0,
  premium: 4,
  premium_plus: null,
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
  const subscription = await getCurrentSubscription();

  if (
    subscription?.status === "active" &&
    (
      subscription.plan === "premium" ||
      subscription.plan === "premium_plus"
    )
  ) {
    return subscription.plan;
  }

  return "free";
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
    (plan === "premium" || plan === "premium_plus")
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
    (plan === "premium" || plan === "premium_plus")
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
    (plan === "premium" || plan === "premium_plus")
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
    (plan === "premium" || plan === "premium_plus")
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
    (plan === "premium" || plan === "premium_plus")
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
  return plan === "premium" || plan === "premium_plus";
}

export function canAddFamilyMember(
  currentMemberCount: number,
  plan: SubscriptionPlan
): boolean {
  return canAddWithinLimit(
    currentMemberCount,
    FAMILY_LIMITS[plan]
  );
}

export function canUseAutoBackup(
  plan: SubscriptionPlan
): boolean {
  // Automatic Backup is reserved for Premium Plus.
  return plan === "premium_plus";
}

export function canUseAnalytics(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium" || plan === "premium_plus";
}

export function canExportAnalyticsPdf(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium" || plan === "premium_plus";
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
    return `${featureName} is limited to ${limit} on the Free plan. Upgrade to Premium for ₹69 one-time to unlock more.`;
  }

  return `${featureName} is available with Premium for ₹69 one-time.`;
}


/*
 * =========================================================
 * PREMIUM PLUS FEATURE HELPERS
 * =========================================================
 *
 * Premium Plus is a separate subscription tier.
 * These helpers identify features reserved for Premium Plus.
 * The actual cloud storage/backup implementation will be
 * added in a future step.
 */

export function canUsePremiumPlus(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium_plus";
}

export function canUseFileUploads(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium_plus";
}

export function canUseCloudStorage(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium_plus";
}

export function canUseCloudBackup(
  plan: SubscriptionPlan
): boolean {
  return plan === "premium_plus";
}
