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
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";

import { useAuth } from "./context/AuthContext";

import SideDrawer from "./components/SideDrawer";

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

    const isAuthenticated =
      !!session;

    if (
      isAuthenticated &&
      !wasAuthenticated.current
    ) {
      setPage(
        "dashboard"
      );

      setDrawerOpen(
        false
      );
    }

    wasAuthenticated.current =
      isAuthenticated;

  }, [
    session,
    loading,
  ]);

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
   * PASSWORD RESET
   * ============================================================
   */

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
    </>
  );
}

export default App;