import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import UserDetails from "../components/UserDetails";

import {
  canAddFamilyMember,
  getCurrentPlan,
  type SubscriptionPlan,
} from "../services/subscriptionService";

import {
  createBackup,
  restoreBackup,
} from "../services/backupService";


interface FamilyMember {
  family_id: string;
  family_name: string;
  member_id: number;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}


interface FamilyInvitation {
  id: string;
  family_id: string;
  family_name: string;
  email: string;
  role: string;
  invited_by: string;
  status: string;
  created_at: string;
  expires_at: string;
}


interface InvitableUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}


interface BackupSchedule {
  id: string;
  user_id: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  run_time: string;
  weekday: number | null;
  day_of_month: number | null;
  created_at: string;
  updated_at: string;
}


interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
  };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

interface RazorpayWindow extends Window {
  Razorpay?: new (
    options: RazorpayCheckoutOptions
  ) => RazorpayCheckoutInstance;
}

interface SettingsProps {
  onNavigate?: (page: string) => void;
}

function Settings({ onNavigate }: SettingsProps) {

  const [, setBackupSchedule] =
    useState<BackupSchedule | null>(null);

  const [backupFrequency, setBackupFrequency] =
    useState<"daily" | "weekly" | "monthly">("daily");

  const [backupTime, setBackupTime] =
    useState("09:00");

  const [backupWeekday, setBackupWeekday] =
    useState("1");

  const [backupDayOfMonth, setBackupDayOfMonth] =
    useState("1");

  const [backupEnabled, setBackupEnabled] =
    useState(false);

  const [loadingBackupSchedule, setLoadingBackupSchedule] =
    useState(true);

  const [savingBackupSchedule, setSavingBackupSchedule] =
    useState(false);


  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [currentUserEmail, setCurrentUserEmail] =
    useState("");

  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");

  const [loadingSubscriptionPlan, setLoadingSubscriptionPlan] =
    useState(true);

  const [creatingPremiumOrder, setCreatingPremiumOrder] =
    useState(false);

  const [verifyingPremiumPayment, setVerifyingPremiumPayment] =
    useState(false);


  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>([]);

  const [invitations, setInvitations] =
    useState<FamilyInvitation[]>([]);

  const [invitableUsers, setInvitableUsers] =
    useState<InvitableUser[]>([]);


  const [searchText, setSearchText] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState<InvitableUser | null>(null);


  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [sendingInvitation, setSendingInvitation] =
    useState(false);

  const [acceptingInvitationId, setAcceptingInvitationId] =
    useState<string | null>(null);

  const [removingMemberId, setRemovingMemberId] =
    useState<number | null>(null);


  const fileInputRef =
    useRef<HTMLInputElement>(null);


  const [lastBackupAt, setLastBackupAt] =
    useState<string | null>(null);



  /*
   * ============================================================
   * LOAD FAMILY DATA
   * ============================================================
   */

  useEffect(() => {
    void loadFamilyData();
  }, []);


  async function loadFamilyData() {
    setLoadingFamily(true);
    setLoadingSubscriptionPlan(true);

    try {
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();


      if (userError) {
        throw userError;
      }


      const user =
        userData.user;


      if (!user?.id) {
        throw new Error(
          "Authentication required."
        );
      }


      setCurrentUserId(
        user.id
      );

      setCurrentUserEmail(
        user.email ?? ""
      );

      const plan = await getCurrentPlan();
      setSubscriptionPlan(plan);

      if (plan !== "free") {
        await loadLastBackup(user.id);
      }

      if (plan === "premium_plus") {
        await loadBackupSchedule();
      } else {
        setLoadingBackupSchedule(false);
      }


      /*
       * Family members
       */

      const {
        data: membersData,
        error: membersError,
      } = await supabase.rpc(
        "get_my_family_members"
      );


      if (membersError) {
        throw membersError;
      }


      setFamilyMembers(
        (membersData ??
          []) as FamilyMember[]
      );


      /*
       * Family invitations
       */

      const {
        data: invitationsData,
        error: invitationsError,
      } = await supabase.rpc(
        "get_my_family_invitations"
      );


      if (invitationsError) {
        throw invitationsError;
      }


      setInvitations(
        (invitationsData ??
          []) as FamilyInvitation[]
      );


      /*
       * Registered users
       * available for invitation.
       */

      const {
        data: usersData,
        error: usersError,
      } = await supabase.rpc(
        "get_invitable_users"
      );


      if (usersError) {
        throw usersError;
      }


      setInvitableUsers(
        (usersData ??
          []) as InvitableUser[]
      );

    } catch (error) {
      console.error(
        "Family settings load error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load family information."
      );

    } finally {
      setLoadingFamily(false);
      setLoadingSubscriptionPlan(false);
    }
  }


  /*
   * ============================================================
   * AUTO BACKUP SCHEDULE
   * ============================================================
   */

  async function loadLastBackup(
    userId: string
  ) {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("backup_registry")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setLastBackupAt(
        data?.created_at ?? null
      );
    } catch (error) {
      console.error(
        "Last backup load error:",
        error
      );
    }
  }


  async function loadBackupSchedule() {
    setLoadingBackupSchedule(true);

    try {
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const user = userData.user;

      if (!user?.id) {
        throw new Error("Authentication required.");
      }

      const {
        data,
        error,
      } = await supabase
        .from("backup_schedules")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const schedule =
        data as BackupSchedule | null;

      setBackupSchedule(schedule);
      setBackupEnabled(schedule?.enabled ?? false);
      setBackupFrequency(
        schedule?.frequency ?? "daily"
      );
      setBackupTime(
        schedule?.run_time?.slice(0, 5) ?? "09:00"
      );
      setBackupWeekday(
        String(schedule?.weekday ?? 1)
      );
      setBackupDayOfMonth(
        String(schedule?.day_of_month ?? 1)
      );
    } catch (error) {
      console.error(
        "Auto backup schedule load error:",
        error
      );
    } finally {
      setLoadingBackupSchedule(false);
    }
  }


  async function handleSaveBackupSchedule() {
    if (!currentUserId) {
      alert("Authentication required.");
      return;
    }

    const plan = await getCurrentPlan();

    if (plan !== "premium_plus") {
      alert(
        "Automatic Backup is available only with Premium Plus."
      );
      return;
    }

    if (
      backupFrequency === "weekly" &&
      !backupWeekday
    ) {
      alert("Please select a weekday.");
      return;
    }

    if (
      backupFrequency === "monthly" &&
      !backupDayOfMonth
    ) {
      alert("Please select a day of the month.");
      return;
    }

    setSavingBackupSchedule(true);

    try {
      const payload = {
        user_id: currentUserId,
        enabled: backupEnabled,
        frequency: backupFrequency,
        run_time: backupTime,
        weekday:
          backupFrequency === "weekly"
            ? Number(backupWeekday)
            : null,
        day_of_month:
          backupFrequency === "monthly"
            ? Number(backupDayOfMonth)
            : null,
      };

      const {
        data,
        error,
      } = await supabase
        .from("backup_schedules")
        .upsert(
          payload,
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBackupSchedule(
        data as BackupSchedule
      );

      alert(
        backupEnabled
          ? "Automatic backup schedule saved successfully."
          : "Automatic backup has been disabled."
      );
    } catch (error) {
      console.error(
        "Auto backup schedule save error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save automatic backup schedule."
      );
    } finally {
      setSavingBackupSchedule(false);
    }
  }


  /*
   * ============================================================
   * PREMIUM PAYMENT
   * ============================================================
   *
   * Creates a Razorpay order through the Supabase Edge Function,
   * opens Razorpay Checkout in Test Mode, and sends the successful
   * Checkout response to the verification Edge Function.
   *
   * Premium is activated only by the server-side verification
   * function after Razorpay confirms the captured payment.
   */

  async function loadRazorpayCheckout() {
    const razorpayWindow =
      window as RazorpayWindow;

    if (razorpayWindow.Razorpay) {
      return razorpayWindow.Razorpay;
    }

    const existingScript =
      document.querySelector<HTMLScriptElement>(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      await new Promise<void>((resolve, reject) => {
        if (
          (window as RazorpayWindow).Razorpay
        ) {
          resolve();
          return;
        }

        existingScript.addEventListener(
          "load",
          () => resolve(),
          { once: true }
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "Unable to load Razorpay Checkout."
              )
            ),
          { once: true }
        );
      });
    } else {
      await new Promise<void>((resolve, reject) => {
        const script =
          document.createElement("script");

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload = () =>
          resolve();

        script.onerror = () =>
          reject(
            new Error(
              "Unable to load Razorpay Checkout."
            )
          );

        document.body.appendChild(
          script
        );
      });
    }

    const loadedRazorpay =
      (window as RazorpayWindow).Razorpay;

    if (!loadedRazorpay) {
      throw new Error(
        "Razorpay Checkout loaded, but the Razorpay object is unavailable."
      );
    }

    return loadedRazorpay;
  }


  async function handleCreatePremiumOrder() {
    if (
      creatingPremiumOrder ||
      verifyingPremiumPayment
    ) {
      return;
    }

    if (
      subscriptionPlan === "premium" ||
      subscriptionPlan === "premium_plus"
    ) {
      alert(
        "This account already has an active Premium plan."
      );
      return;
    }

    setCreatingPremiumOrder(true);

    try {
      const Razorpay =
        await loadRazorpayCheckout();

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "create-premium-order",
        {
          body: {},
        }
      );

      if (error) {
        console.error(
          "Premium order function error:",
          error
        );

        throw new Error(
          error.message ||
            "Unable to create Premium payment order."
        );
      }

      if (
        !data?.success ||
        !data?.order_id ||
        !data?.key_id
      ) {
        throw new Error(
          data?.error ||
            "Razorpay order was not created."
        );
      }

      const orderId =
        String(data.order_id);

      const paymentAmount =
        Number(data.amount ?? 6900);

      const currency =
        String(data.currency ?? "INR");

      setCreatingPremiumOrder(false);
      setVerifyingPremiumPayment(true);

      const checkoutOptions: RazorpayCheckoutOptions = {
        key: String(data.key_id),
        amount: paymentAmount,
        currency,
        name: "EV Toolkit",
        description: "EV Toolkit Premium",
        order_id: orderId,
        prefill: {
          email:
            currentUserEmail || undefined,
        },
        handler: async (response) => {
          try {
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            if (
              razorpay_order_id !==
              orderId
            ) {
              throw new Error(
                "Razorpay returned an unexpected order ID."
              );
            }

            const {
              data: verificationData,
              error: verificationError,
            } =
              await supabase.functions.invoke(
                "verify-premium-payment",
                {
                  body: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                  },
                }
              );

            if (verificationError) {
              console.error(
                "Premium payment verification function error:",
                verificationError
              );

              throw new Error(
                verificationError.message ||
                  "Payment verification failed."
              );
            }

            if (
              !verificationData?.success ||
              verificationData?.plan !==
                "premium"
            ) {
              throw new Error(
                verificationData?.error ||
                  "Payment could not be verified."
              );
            }

            const refreshedPlan =
              await getCurrentPlan();

            setSubscriptionPlan(
              refreshedPlan
            );

            alert(
              "Premium payment verified successfully.\n\nYour Premium plan is now active."
            );
          } catch (error) {
            console.error(
              "Premium payment verification error:",
              error
            );

            alert(
              error instanceof Error
                ? error.message
                : "Payment was received, but verification could not be completed. Please contact support before trying again."
            );
          } finally {
            setVerifyingPremiumPayment(
              false
            );
          }
        },
        modal: {
          ondismiss: () => {
            setVerifyingPremiumPayment(
              false
            );
          },
        },
      };

      const checkout =
        new Razorpay(
          checkoutOptions
        );

      checkout.open();
    } catch (error) {
      console.error(
        "Premium payment start error:",
        error
      );

      setVerifyingPremiumPayment(
        false
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start Premium payment."
      );
    } finally {
      setCreatingPremiumOrder(
        false
      );
    }
  }


  /*
   * ============================================================
   * FAMILY
   * ============================================================
   */

  const family =
    familyMembers.length > 0
      ? familyMembers[0]
      : null;


  const isFamilyOwner =
    family !== null &&
    family.user_id ===
      currentUserId &&
    family.role ===
      "owner";

  // The Premium limit applies to added members and does not count the owner.
  // Pending invitations also reserve a family-member slot.
  const currentFamilyMemberCount =
    familyMembers.filter(
      (member) => member.role !== "owner"
    ).length +
    invitations.filter(
      (invitation) =>
        invitation.family_id === family?.family_id &&
        invitation.status === "pending"
    ).length;

  const familyMemberLimitReached =
    subscriptionPlan === "premium" &&
    !canAddFamilyMember(
      currentFamilyMemberCount,
      subscriptionPlan
    );


  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  function normalizeEmail(
    email: string
  ) {
    return email
      .trim()
      .toLowerCase();
  }


  function isAlreadyFamilyMember(
    email: string
  ) {
    const normalizedEmail =
      normalizeEmail(
        email
      );


    return familyMembers.some(
      (member) =>
        normalizeEmail(
          member.email
        ) === normalizedEmail
    );
  }


  function getPendingInvitation(
    email: string
  ) {
    const normalizedEmail =
      normalizeEmail(
        email
      );


    return invitations.find(
      (invitation) =>
        invitation.family_id ===
          family?.family_id &&
        invitation.status ===
          "pending" &&
        normalizeEmail(
          invitation.email
        ) === normalizedEmail
    );
  }


  /*
   * ============================================================
   * FILTER INVITABLE USERS
   * ============================================================
   *
   * Search:
   *   - first name
   *   - last name
   *   - email
   *
   * Also exclude:
   *   - current family members
   *   - users with pending invitations
   */

  const normalizedSearch =
    searchText
      .trim()
      .toLowerCase();


  const availableUsers =
    invitableUsers.filter(
      (user) => {

        if (
          isAlreadyFamilyMember(
            user.email
          )
        ) {
          return false;
        }


        if (
          getPendingInvitation(
            user.email
          )
        ) {
          return false;
        }


        if (
          !normalizedSearch
        ) {
          return true;
        }


        const firstName =
          (
            user.first_name ??
            ""
          ).toLowerCase();

        const lastName =
          (
            user.last_name ??
            ""
          ).toLowerCase();

        const email =
          (
            user.email ??
            ""
          ).toLowerCase();


        const fullName =
          `${firstName} ${lastName}`
            .trim()
            .toLowerCase();


        return (
          firstName.includes(
            normalizedSearch
          ) ||
          lastName.includes(
            normalizedSearch
          ) ||
          email.includes(
            normalizedSearch
          ) ||
          fullName.includes(
            normalizedSearch
          )
        );
      }
    );


  /*
   * ============================================================
   * INVITE MEMBER
   * ============================================================
   */

  async function handleInvite() {
    if (!isFamilyOwner) {
      alert(
        "Only the family owner can invite members."
      );

      return;
    }


    if (!family?.family_id) {
      alert(
        "Family information is not available."
      );

      return;
    }


    if (familyMemberLimitReached) {
      alert(
        "Premium allows up to 4 added family members. Remove an existing member or upgrade to Premium Plus for unlimited family members."
      );

      return;
    }


    if (!selectedUser) {
      alert(
        "Please select a family member."
      );

      return;
    }


    const email =
      normalizeEmail(
        selectedUser.email
      );


    if (
      isAlreadyFamilyMember(
        email
      )
    ) {
      alert(
        "This user is already a member of your family."
      );

      return;
    }


    if (
      getPendingInvitation(
        email
      )
    ) {
      alert(
        "An invitation is already pending for this user."
      );

      return;
    }


    setSendingInvitation(
      true
    );


    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "create_family_invitation",
        {
          p_family_id:
            family.family_id,

          p_email:
            email,

          p_role:
            "member",
        }
      );


      if (error) {
        throw error;
      }


      console.log(
        "Family invitation created:",
        data
      );


      alert(
        `Invitation sent to ${email}.`
      );


      setSearchText(
        ""
      );

      setSelectedUser(
        null
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Family invitation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to send family invitation."
      );

    } finally {
      setSendingInvitation(
        false
      );
    }
  }


  /*
   * ============================================================
   * ACCEPT INVITATION
   * ============================================================
   */

  async function handleAcceptInvitation(
    invitationId: string
  ) {
    if (
      acceptingInvitationId
    ) {
      return;
    }


    setAcceptingInvitationId(
      invitationId
    );


    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "accept_family_invitation",
        {
          p_invitation_id:
            invitationId,
        }
      );


      if (error) {
        throw error;
      }


      console.log(
        "Family invitation accepted:",
        data
      );


      alert(
        "Family invitation accepted successfully."
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Accept invitation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to accept family invitation."
      );

    } finally {
      setAcceptingInvitationId(
        null
      );
    }
  }


  /*
   * ============================================================
   * REMOVE MEMBER
   * ============================================================
   */

  async function handleRemoveMember(
    member: FamilyMember
  ) {
    if (!isFamilyOwner) {
      return;
    }


    if (
      member.user_id ===
      currentUserId
    ) {
      alert(
        "The family owner cannot remove themselves."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `Remove ${member.email} from the family?`
      );


    if (!confirmed) {
      return;
    }


    setRemovingMemberId(
      member.member_id
    );


    try {
      const {
        error,
      } = await supabase
        .from("family_members")
        .delete()
        .eq(
          "id",
          member.member_id
        )
        .eq(
          "family_id",
          member.family_id
        );


      if (error) {
        throw error;
      }


      alert(
        `${member.email} has been removed from the family.`
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Remove family member error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove family member."
      );

    } finally {
      setRemovingMemberId(
        null
      );
    }
  }


  /*
   * ============================================================
   * BACKUP / RESTORE
   * ============================================================
   */

  async function handleCreateBackup() {
    if (subscriptionPlan === "free") {
      return;
    }

    try {
      await createBackup();

      if (currentUserId) {
        await loadLastBackup(currentUserId);
      }
    } catch (error) {
      console.error(
        "Backup creation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to create backup."
      );
    }
  }


  async function handleRestore(
    file: File
  ) {
    if (subscriptionPlan === "free") {
      return;
    }

    try {
      await restoreBackup(
        file
      );

    } catch (err: any) {
      console.error(
        "Backup restore error:",
        err
      );

      alert(
        err?.message ||
          "Unable to restore backup. Please check the browser console for details."
      );

    } finally {
      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    }
  }


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

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
        <UserDetails
          onClick={() => {
            onNavigate?.("profile");
          }}
        />
      </div>

      <div className="welcome">

        <h2>
          ⚙️ Settings
        </h2>

        <p>
          Customize your EV Toolkit
          preferences.
        </p>

      </div>


      {/* ======================================================
          SUBSCRIPTION
          ====================================================== */}

      <div className="card">

        <h3>
          ⭐ Subscription
        </h3>

        {loadingSubscriptionPlan ? (

          <p style={{ marginTop: 12 }}>
            Loading subscription...
          </p>

        ) : subscriptionPlan === "free" ? (

          <>
            <p
              style={{
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              You are currently using the Free plan.
              Premium is a ₹69 one-time payment and unlocks
              additional EV Toolkit features.
            </p>

            <button
              className="primaryButton"
              disabled={
                creatingPremiumOrder ||
                verifyingPremiumPayment
              }
              onClick={() =>
                void handleCreatePremiumOrder()
              }
              style={{
                marginTop: "16px",
              }}
            >
              {creatingPremiumOrder
                ? "Creating Payment Order..."
                : verifyingPremiumPayment
                  ? "Verifying Payment..."
                  : "Upgrade to Premium — ₹69"}
            </button>

            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "10px",
                lineHeight: 1.5,
              }}
            >
              Razorpay Test Mode is currently being used.
              Premium access is granted only after successful
              payment verification.
            </p>
          </>

        ) : (

          <div
            style={{
              marginTop: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              background:
                subscriptionPlan === "premium_plus"
                  ? "#eff6ff"
                  : "#fef2f2",
              border:
                subscriptionPlan === "premium_plus"
                  ? "1px solid #93c5fd"
                  : "1px solid #fecaca",
              color:
                subscriptionPlan === "premium_plus"
                  ? "#1d4ed8"
                  : "#b91c1c",
              fontWeight: 700,
            }}
          >
            <span>
              {subscriptionPlan === "premium_plus"
                ? "Premium Plus"
                : "Premium"}
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

      </div>


      {/* ======================================================
          FAMILY SHARING
          ====================================================== */}

      <div className="card">

        <h3>
          👨‍👩‍👧 Family Sharing
        </h3>

        {loadingSubscriptionPlan ? (

          <p style={{ marginTop: 12 }}>
            Loading family sharing...
          </p>

        ) : subscriptionPlan === "free" ? (

          <div
            style={{
              marginTop: "16px",
              padding: "14px 16px",
              border: "1px solid #93c5fd",
              borderRadius: "8px",
              background: "#eff6ff",
              color: "#1e3a8a",
              maxWidth: "520px",
            }}
          >
            <div style={{ fontWeight: 700 }}>
              Premium feature
            </div>

            <div
              style={{
                fontSize: "13px",
                marginTop: "5px",
                lineHeight: 1.5,
              }}
            >
              Family Sharing is available with Premium for
              ₹69 one-time. Upgrade to add and invite family
              members.
            </div>
          </div>

        ) : loadingFamily ? (

          <p>
            Loading family information...
          </p>

        ) : family ? (

          <>
            <p
              style={{
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {family.family_name}
            </p>

            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "6px",
              }}
            >
              Family members can view each other's EV Toolkit
              data. Each member can modify only records they
              created.
            </p>

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <h4>
                Family Members
              </h4>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "6px",
                  marginBottom: 0,
                }}
              >
                {subscriptionPlan === "premium"
                  ? `Premium allows up to 4 added family members. ${Math.min(currentFamilyMemberCount, 4)}/4 slots used.`
                  : "Premium Plus allows unlimited family members."}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >
                {familyMembers.map(
                  (member) => {

                    const isCurrentUser =
                      member.user_id ===
                      currentUserId;

                    const isOwner =
                      member.role ===
                      "owner";

                    const displayName =
                      member.email;

                    return (
                      <div
                        key={
                          member.member_id
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "12px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {displayName}

                            {isCurrentUser && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginTop: "4px",
                            }}
                          >
                            {isOwner
                              ? "Owner"
                              : "Member"}
                          </div>
                        </div>

                        {isFamilyOwner &&
                          !isOwner && (
                            <button
                              className="deleteButton"
                              disabled={
                                removingMemberId ===
                                member.member_id
                              }
                              onClick={() =>
                                void handleRemoveMember(
                                  member
                                )
                              }
                            >
                              {removingMemberId ===
                              member.member_id
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {isFamilyOwner && (
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >
                <h4>
                  Invite Family Member
                </h4>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "6px",
                  }}
                >
                  Search registered users
                  by first name, last name,
                  or email address.
                </p>

                {familyMemberLimitReached && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px 14px",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                      background: "#fffbeb",
                      color: "#92400e",
                      maxWidth: "520px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    You have reached the Premium limit of 4 added family members. Premium Plus will support unlimited family members.
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    marginTop: "14px",
                    maxWidth: "520px",
                  }}
                >
                  <input
                    type="text"
                    value={
                      searchText
                    }
                    placeholder="Search by first name, last name, or email..."
                    disabled={
                      sendingInvitation
                    }
                    onChange={(e) => {
                      setSearchText(
                        e.target.value
                      );

                      setSelectedUser(
                        null
                      );
                    }}
                    style={{
                      width: "100%",
                    }}
                  />

                  {searchText.trim() !== "" &&
                    !selectedUser && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        marginTop: "4px",
                        maxHeight: "280px",
                        overflowY: "auto",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      {availableUsers.length >
                      0 ? (
                        availableUsers.map(
                          (user) => {

                            const fullName =
                              `${user.first_name ?? ""} ${user.last_name ?? ""}`
                                .trim();

                            return (
                              <button
                                key={
                                  user.user_id
                                }
                                type="button"
                                onClick={() => {
                                  setSelectedUser(
                                    user
                                  );

                                  setSearchText(
                                    fullName ||
                                      user.email
                                  );
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  border: "none",
                                  background: "transparent",
                                  padding: "12px 14px",
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {fullName ||
                                    user.email}
                                </div>

                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    marginTop: "3px",
                                  }}
                                >
                                  {
                                    user.email
                                  }
                                </div>
                              </button>
                            );
                          }
                        )
                      ) : (
                        <div
                          style={{
                            padding: "12px 14px",
                            fontSize: "13px",
                            color: "#6b7280",
                          }}
                        >
                          No matching users found.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: "8px",
                      maxWidth: "520px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {`${selectedUser.first_name ?? ""} ${selectedUser.last_name ?? ""}`
                          .trim() ||
                          selectedUser.email}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "3px",
                        }}
                      >
                        {
                          selectedUser.email
                        }
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Role: <strong>Member</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        sendingInvitation
                      }
                      onClick={() => {
                        setSelectedUser(
                          null
                        );

                        setSearchText(
                          ""
                        );
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      aria-label="Clear selected user"
                    >
                      ×
                    </button>
                  </div>
                )}

                <button
                  className="primaryButton"
                  disabled={
                    sendingInvitation ||
                    !selectedUser ||
                    familyMemberLimitReached
                  }
                  onClick={() =>
                    void handleInvite()
                  }
                  style={{
                    marginTop: "12px",
                  }}
                >
                  {sendingInvitation
                    ? "Sending..."
                    : "Invite Member"}
                </button>
              </div>
            )}

            {invitations.some(
              (invitation) =>
                invitation.status ===
                "pending"
            ) && (
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >
                <h4>
                  Pending Invitations
                </h4>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  {invitations
                    .filter(
                      (invitation) =>
                        invitation.status ===
                        "pending"
                    )
                    .map(
                      (invitation) => {

                        const invitationIsForCurrentUser =
                          normalizeEmail(
                            invitation.email
                          ) ===
                          normalizeEmail(
                            currentUserEmail
                          );

                        return (
                          <div
                            key={
                              invitation.id
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              padding: "12px",
                              border:
                                "1px solid #e5e7eb",
                              borderRadius:
                                "8px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                {
                                  invitation.email
                                }
                              </div>

                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginTop: "4px",
                                }}
                              >
                                {
                                  invitation.family_name
                                }
                                {" • Member"}
                              </div>
                            </div>

                            {invitationIsForCurrentUser ? (
                              <button
                                className="primaryButton"
                                disabled={
                                  acceptingInvitationId ===
                                  invitation.id
                                }
                                onClick={() =>
                                  void handleAcceptInvitation(
                                    invitation.id
                                  )
                                }
                              >
                                {acceptingInvitationId ===
                                invitation.id
                                  ? "Accepting..."
                                  : "Accept"}
                              </button>
                            ) : (
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#d97706",
                                }}
                              >
                                Pending
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            )}
          </>

        ) : (

          <div>
            <p
              style={{
                marginTop: "8px",
              }}
            >
              You are not currently a member of a family.
            </p>

            {invitations
              .filter(
                (invitation) =>
                  invitation.status ===
                    "pending" &&
                  normalizeEmail(
                    invitation.email
                  ) ===
                    normalizeEmail(
                      currentUserEmail
                    )
              )
              .map(
                (invitation) => (
                  <div
                    key={
                      invitation.id
                    }
                    style={{
                      marginTop: "16px",
                      padding: "14px",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        "8px",
                    }}
                  >
                    <p>
                      You have been invited
                      to join{" "}
                      <strong>
                        {
                          invitation.family_name
                        }
                      </strong>
                      .
                    </p>

                    <button
                      className="primaryButton"
                      style={{
                        marginTop: "10px",
                      }}
                      disabled={
                        acceptingInvitationId ===
                        invitation.id
                      }
                      onClick={() =>
                        void handleAcceptInvitation(
                          invitation.id
                        )
                      }
                    >
                      {acceptingInvitationId ===
                      invitation.id
                        ? "Accepting..."
                        : "Accept Invitation"}
                    </button>
                  </div>
                )
              )}
          </div>
        )}

      </div>


      {/* ======================================================
          BACKUP & RESTORE
          ====================================================== */}

      {!loadingSubscriptionPlan && subscriptionPlan !== "free" && (
        <div className="card">

        <h3>
          💾 Backup & Restore
        </h3>

        <p>
          Export all your EV Toolkit
          data into a single backup
          file or restore it later on
          any device.
        </p>


        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            maxWidth: "520px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Last Backup
          </div>

          <div
            style={{
              marginTop: "4px",
              fontWeight: 600,
            }}
          >
            {lastBackupAt
              ? new Date(lastBackupAt).toLocaleString()
              : "No backup created yet"}
          </div>
        </div>


        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          <button
            className="primaryButton"
            onClick={() =>
              void handleCreateBackup()
            }
          >
            📥 Create Backup
          </button>


          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{
              display: "none",
            }}
            onChange={async (e) => {

              const file =
                e.target.files?.[0];


              if (!file) {
                return;
              }


              await handleRestore(
                file
              );
            }}
          />


          <button
            className="restoreButton"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            📤 Restore Backup
          </button>

        </div>


        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "12px",
          }}
        >
          Backup includes Charging
          History, Service History,
          Tyre History, Document Vault,
          Insurance and future supported
          modules.
        </p>

        </div>
      )}


      {/* ======================================================
          AUTOMATIC BACKUP
          ====================================================== */}

      {!loadingSubscriptionPlan && subscriptionPlan === "premium_plus" && (
        <div className="card">

        <h3>
          🔄 Automatic Backup
        </h3>

        <p
          style={{
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          Automatically create a backup
          according to a daily, weekly,
          or monthly schedule.
        </p>

        {loadingBackupSchedule ? (
          <p style={{ marginTop: 16 }}>
            Loading backup settings...
          </p>
        ) : (
          <>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                maxWidth: 520,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={backupEnabled}
                  disabled={savingBackupSchedule}
                  onChange={(e) =>
                    setBackupEnabled(e.target.checked)
                  }
                  style={{ width: 18, height: 18 }}
                />
                <span>
                  Enable Automatic Backup
                </span>
              </label>

              {backupEnabled && (
                <>
                  <div>
                    <label>Backup Frequency</label>
                    <select
                      value={backupFrequency}
                      disabled={savingBackupSchedule}
                      onChange={(e) =>
                        setBackupFrequency(
                          e.target.value as
                            | "daily"
                            | "weekly"
                            | "monthly"
                        )
                      }
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label>Backup Time</label>
                    <input
                      type="time"
                      value={backupTime}
                      disabled={savingBackupSchedule}
                      onChange={(e) =>
                        setBackupTime(e.target.value)
                      }
                    />
                  </div>

                  {backupFrequency === "weekly" && (
                    <div>
                      <label>Weekday</label>
                      <select
                        value={backupWeekday}
                        disabled={savingBackupSchedule}
                        onChange={(e) =>
                          setBackupWeekday(e.target.value)
                        }
                      >
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="7">Sunday</option>
                      </select>
                    </div>
                  )}

                  {backupFrequency === "monthly" && (
                    <div>
                      <label>Day of Month</label>
                      <select
                        value={backupDayOfMonth}
                        disabled={savingBackupSchedule}
                        onChange={(e) =>
                          setBackupDayOfMonth(e.target.value)
                        }
                      >
                        {Array.from(
                          { length: 28 },
                          (_, index) => (
                            <option
                              key={index + 1}
                              value={index + 1}
                            >
                              {index + 1}
                            </option>
                          )
                        )}
                      </select>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          marginTop: 6,
                        }}
                      >
                        Select up to day 28 so the schedule is valid for every month.
                      </p>
                    </div>
                  )}

                  <button
                    className="primaryButton"
                    disabled={savingBackupSchedule}
                    onClick={() =>
                      void handleSaveBackupSchedule()
                    }
                    style={{
                      marginTop: 4,
                      alignSelf: "flex-start",
                    }}
                  >
                    {savingBackupSchedule
                      ? "Saving..."
                      : "Save Backup Schedule"}
                  </button>
                </>
              )}
            </div>

            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              Automatic Backup and Cloud Backup are Premium Plus features.
            </p>
          </>
        )}

        </div>
      )}

    </>
  );
}


export default Settings;