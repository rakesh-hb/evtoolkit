import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountDeletion from "./pages/AccountDeletion";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";

import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

import SideDrawer from "./components/SideDrawer";
import FirstLoginGuide from "./components/FirstLoginGuide";
import WhatsNewPopup from "./components/WhatsNewPopup";

/*
 * ============================================================
 * LAZY-LOADED APPLICATION PAGES
 * ============================================================
 *
 * These pages are loaded only when the user opens them.
 *
 * This reduces the size of the initial JavaScript bundle.
 */

const Dashboard =
  lazy(() =>
    import("./pages/Dashboard")
  );

const Planner =
  lazy(() =>
    import("./pages/Planner")
  );

const Tracker =
  lazy(() =>
    import("./pages/Tracker")
  );

const Analytics =
  lazy(() =>
    import("./pages/Analytics")
  );

const Settings =
  lazy(() =>
    import("./pages/Settings")
  );

const ServiceHistory =
  lazy(() =>
    import("./pages/ServiceHistory")
  );

const TyreHistory =
  lazy(() =>
    import("./pages/TyreHistory")
  );

const Insurance =
  lazy(() =>
    import("./pages/Insurance")
  );

const DocumentVault =
  lazy(() =>
    import("./pages/DocumentVault")
  );

const About =
  lazy(() =>
    import("./pages/About")
  );

const UserProfile =
  lazy(() =>
    import("./pages/UserProfile")
  );

const HowToUse =
  lazy(() =>
    import("./pages/HowToUse")
  );

  const WhatsNewPage = lazy(() => import("./components/WhatsNew"));

/*
 * ============================================================
 * PAGE LOADING FALLBACK
 * ============================================================
 */

function PageLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
      }}
    >
      ⚡ Loading...
    </div>
  );
}

function App() {
  const {
    session,
    loading,
  } = useAuth();

  const [page, setPage] =
    useState("dashboard");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [authPage, setAuthPage] =
    useState<
      "login" | "forgot"
    >("login");

  const [showFirstLoginGuide, setShowFirstLoginGuide] =
    useState(false);

  const [showWhatsNew, setShowWhatsNew] =
    useState(false);

  const [activeAnnouncement, setActiveAnnouncement] =
    useState<{
      id: string;
      version: string;
      title: string;
      message: string;
    } | null>(null);

  const [pendingFirstLoginGuide, setPendingFirstLoginGuide] =
    useState(false);

  const authCheckId = useRef(0);

  /*
   * Keep track of whether the previous
   * auth state was authenticated.
   *
   * This lets us detect a NEW login.
   */

  const wasAuthenticated =
    useRef(false);

  /*
   * ============================================================
   * RESET PAGE AFTER LOGIN
   * ============================================================
   */

  useEffect(() => {
    if (loading) {
      return;
    }

    const isAuthenticated = !!session;

    if (isAuthenticated && !wasAuthenticated.current) {
      const currentCheckId = ++authCheckId.current;
      const userId = session.user.id;

      setPage("dashboard");
      setDrawerOpen(false);
      setShowWhatsNew(false);
      setActiveAnnouncement(null);
      setShowFirstLoginGuide(false);
      setPendingFirstLoginGuide(false);

      const checkLoginAnnouncementsAndGuide = async () => {
        let shouldShowGuide = true;
        let announcementToShow: {
          id: string;
          version: string;
          title: string;
          message: string;
        } | null = null;

        // Check the existing How to Use preference without changing it.
        try {
          const { data, error } = await supabase
            .from("user_vehicle_preferences")
            .select("how_to_use_dismissed")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            console.error(
              "Failed to load How to Use preference:",
              error
            );
          } else {
            shouldShowGuide =
              !data || data.how_to_use_dismissed !== true;
          }
        } catch (error) {
          console.error(
            "Unexpected error loading How to Use preference:",
            error
          );
        }

        // Find the newest active release announcement.
        try {
          const { data: announcement, error: announcementError } =
            await supabase
              .from("app_announcements")
              .select("id, version, title, message")
              .eq("is_active", true)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

          if (announcementError) {
            console.error(
              "Failed to load What's New announcement:",
              announcementError
            );
          } else if (announcement) {
            const { data: acknowledgement, error: acknowledgementError } =
              await supabase
                .from("user_announcement_acknowledgements")
                .select("announcement_id")
                .eq("announcement_id", announcement.id)
                .eq("user_id", userId)
                .maybeSingle();

            if (acknowledgementError) {
              console.error(
                "Failed to check What's New acknowledgement:",
                acknowledgementError
              );
              // Show the announcement if its acknowledgement status is unknown.
              announcementToShow = announcement;
            } else if (!acknowledgement) {
              announcementToShow = announcement;
            }
          }
        } catch (error) {
          console.error(
            "Unexpected error loading What's New announcement:",
            error
          );
        }

        // Ignore stale results if the user logged out or changed accounts.
        if (authCheckId.current !== currentCheckId) {
          return;
        }

        setPendingFirstLoginGuide(shouldShowGuide);

        if (announcementToShow) {
          setActiveAnnouncement(announcementToShow);
          setShowWhatsNew(true);
        } else {
          setShowFirstLoginGuide(shouldShowGuide);
        }
      };

      void checkLoginAnnouncementsAndGuide();
    } else if (!isAuthenticated && wasAuthenticated.current) {
      // Clear account-specific overlays when the user logs out.
      authCheckId.current += 1;
      setShowWhatsNew(false);
      setActiveAnnouncement(null);
      setShowFirstLoginGuide(false);
      setPendingFirstLoginGuide(false);
    }

    wasAuthenticated.current = isAuthenticated;
  }, [session, loading]);

  const isAccountDeletionPage =
    window.location.pathname === "/delete-account";

  const isHowToUsePage =
    window.location.pathname ===
    "/how-to-use";

  const isResetPassword =
    window.location.pathname ===
    "/reset-password";

  /*
   * ============================================================
   * TERMS & CONDITIONS
   * ============================================================
   *
   * Terms & Conditions must be publicly accessible.
   *
   * This check is intentionally placed before the
   * authentication check so users do not need to log in
   * to view the Terms & Conditions.
   */

  const isTermsPage =
    window.location.pathname ===
      "/terms" ||
    window.location.pathname ===
      "/terms-and-conditions";

  /*
   * ============================================================
   * PRIVACY POLICY
   * ============================================================
   *
   * Privacy Policy must also be publicly accessible.
   *
   * Users do not need to log in to view this page.
   */

  const isPrivacyPolicyPage =
    window.location.pathname ===
      "/privacy" ||
    window.location.pathname ===
      "/privacy-policy";

  /*
   * ============================================================
   * RETURN & REFUND POLICY
   * ============================================================
   *
   * Return & Refund Policy must also be publicly accessible.
   *
   * Users do not need to log in to view this page.
   */

  const isRefundPolicyPage =
    window.location.pathname ===
      "/refund" ||
    window.location.pathname ===
      "/return-refund";

  /*
   * ============================================================
   * CANCELLATION POLICY
   * ============================================================
   *
   * Cancellation Policy must also be publicly accessible.
   *
   * Users do not need to log in to view this page.
   */

  const isCancellationPolicyPage =
    window.location.pathname ===
      "/cancellation" ||
    window.location.pathname ===
      "/cancellation-policy";

  /*
   * ============================================================
   * ABOUT EV TOOLKIT
   * ============================================================
   *
   * About Us must also be publicly accessible so payment-gateway
   * reviewers and visitors can view the business/product
   * information without signing in.
   */

  const isAboutPage =
    window.location.pathname ===
      "/about" ||
    window.location.pathname ===
      "/about-us";

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        ⚡ Loading EV Toolkit...
      </div>
    );
  }

  /*
   * ============================================================
   * TERMS & CONDITIONS
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isTermsPage) {
    return (
      <Terms />
    );
  }

  /*
   * ============================================================
   * PRIVACY POLICY
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isPrivacyPolicyPage) {
    return (
      <PrivacyPolicy />
    );
  }

  /*
   * ============================================================
   * ACCOUNT DELETION
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isAccountDeletionPage) {
    return <AccountDeletion />;
  }

  /*
   * ============================================================
   * RETURN & REFUND POLICY
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isRefundPolicyPage) {
    return (
      <RefundPolicy />
    );
  }

  /*
   * ============================================================
   * CANCELLATION POLICY
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isCancellationPolicyPage) {
    return (
      <CancellationPolicy />
    );
  }

  /*
   * ============================================================
   * ABOUT EV TOOLKIT
   * ============================================================
   *
   * Public page — no authentication required.
   */

  if (isAboutPage) {
    return (
      <About />
    );
  }

  /*
   * ============================================================
   * PASSWORD RESET
   * ============================================================
   */

  if (isHowToUsePage) {
    return (
      <HowToUse />
    );
  }

  if (isResetPassword) {
    return (
      <ResetPassword
        onComplete={() => {
          window.history.replaceState(
            {},
            "",
            "/"
          );

          window.location.reload();
        }}
      />
    );
  }

  /*
   * ============================================================
   * NOT AUTHENTICATED
   * ============================================================
   */

  if (!session) {
    if (
      authPage ===
      "forgot"
    ) {
      return (
        <ForgotPassword
          onBack={() =>
            setAuthPage(
              "login"
            )
          }
        />
      );
    }

    return (
      <Login
        onForgotPassword={() =>
          setAuthPage(
            "forgot"
          )
        }
      />
    );
  }

  /*
   * ============================================================
   * CENTRAL PAGE NAVIGATION
   * ============================================================
   *
   * All pages that need to navigate to another page should
   * use this callback.
   */

  function navigateTo(
    selectedPage: string
  ) {
    setPage(selectedPage);
    setDrawerOpen(false);
  }

  /*
   * ============================================================
   * PAGE ROUTING
   * ============================================================
   */

  function renderPage() {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={navigateTo}
          />
        );

      case "planner":
        return (
          <Planner
            onNavigate={navigateTo}
          />
        );

      case "tracker":
        return (
          <Tracker
            onNavigate={navigateTo}
          />
        );

      case "analytics":
        return (
          <Analytics
            onNavigate={
              navigateTo
            }
          />
        );

      case "service":
        return (
          <ServiceHistory
            onNavigate={navigateTo}
          />
        );

      case "tyres":
        return (
          <TyreHistory
            onNavigate={navigateTo}
          />
        );

      case "insurance":
        return (
          <Insurance
            onNavigate={navigateTo}
          />
        );

      case "documents":
        return (
          <DocumentVault
            onNavigate={navigateTo}
          />
        );

      case "settings":
        return (
          <Settings
            onNavigate={navigateTo}
          />
        );

      case "about":
        return (
          <About
            onNavigate={
              navigateTo
            }
          />
        );

      case "profile":
        return (
          <UserProfile />
        );

      case "howto":
        return (
          <HowToUse />
        );

      case "whatsnew":
        return (
          <WhatsNewPage />
        );

      case "terms":
        return (
          <Terms />
        );

      case "privacy":
        return (
          <PrivacyPolicy />
        );

      case "refund":
        return (
          <RefundPolicy />
        );

      case "cancellation":
        return (
          <CancellationPolicy />
        );

      case "delete-account":
        return <AccountDeletion />;

      default:
        return (
          <Dashboard
            onNavigate={navigateTo}
          />
        );
    }
  }

  /*
   * ============================================================
   * AUTHENTICATED APPLICATION
   * ============================================================
   */

  return (
    <>
      <SideDrawer
        open={
          drawerOpen
        }
        currentPage={
          page
        }
        onClose={() =>
          setDrawerOpen(
            false
          )
        }
        onNavigate={(
          selectedPage
        ) => {
          navigateTo(
            selectedPage
          );
        }}
      />

      <main className="content">
        <Suspense
          fallback={
            <PageLoading />
          }
        >
          {renderPage()}
        </Suspense>
      </main>

      <nav className="bottomNav">
        <button
          className={
            page ===
            "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            navigateTo(
              "dashboard"
            )
          }
        >
          <span>
            🏠
          </span>

          <span>
            Home
          </span>
        </button>

        <button
          className={
            page ===
            "planner"
              ? "active"
              : ""
          }
          onClick={() =>
            navigateTo(
              "planner"
            )
          }
        >
          <span>
            ⚡
          </span>

          <span>
            Planner
          </span>
        </button>

        <button
          className={
            page ===
            "tracker"
              ? "active"
              : ""
          }
          onClick={() =>
            navigateTo(
              "tracker"
            )
          }
        >
          <span>
            🔋
          </span>

          <span>
            Charging
          </span>
        </button>

        <button
          className={
            page ===
            "analytics"
              ? "active"
              : ""
          }
          onClick={() =>
            navigateTo(
              "analytics"
            )
          }
        >
          <span>
            📊
          </span>

          <span>
            Analytics
          </span>
        </button>

        <button
          onClick={() =>
            setDrawerOpen(
              true
            )
          }
        >
          <span>
            ☰
          </span>

          <span>
            More
          </span>
        </button>
      </nav>

      {showWhatsNew && activeAnnouncement && session?.user?.id && (
        <WhatsNewPopup
          announcement={activeAnnouncement}
          onAcknowledge={async () => {
            const { error } = await supabase
              .from("user_announcement_acknowledgements")
              .insert({
                announcement_id: activeAnnouncement.id,
                user_id: session.user.id,
              });

            // A duplicate acknowledgement means it was already saved.
            if (error && error.code !== "23505") {
              console.error(
                "Failed to save What's New acknowledgement:",
                error
              );
              throw error;
            }

            setShowWhatsNew(false);
            setActiveAnnouncement(null);

            if (pendingFirstLoginGuide) {
              setShowFirstLoginGuide(true);
            }
          }}
        />
      )}

      {showFirstLoginGuide && (
        <FirstLoginGuide
          onGetStarted={async (dontShowAgain) => {
            if (dontShowAgain && session?.user?.id) {
              try {
                const { error } = await supabase
                  .from("user_vehicle_preferences")
                  .upsert(
                    {
                      user_id: session.user.id,
                      how_to_use_dismissed: true,
                    },
                    { onConflict: "user_id" }
                  );

                if (error) {
                  console.error(
                    "Failed to save How to Use preference:",
                    error
                  );
                  return;
                }
              } catch (error) {
                console.error(
                  "Unexpected error saving How to Use preference:",
                  error
                );
                return;
              }
            }

            setShowFirstLoginGuide(false);
          }}
        />
      )}
    </>
  );
}

export default App;
