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
   * PAGE ROUTING
   * ============================================================
   */

  function renderPage() {

    switch (page) {

      case "dashboard":
        return (
          <Dashboard />
        );


      case "planner":
        return (
          <Planner />
        );


      case "tracker":
        return (
          <Tracker />
        );


      case "analytics":
        return (
          <Analytics />
        );


      case "service":
        return (
          <ServiceHistory />
        );


      case "tyres":
        return (
          <TyreHistory />
        );


      case "insurance":
        return (
          <Insurance />
        );


      case "documents":
        return (
          <DocumentVault />
        );


      case "settings":
        return (
          <Settings />
        );


      case "about":
        return (
          <About />
        );


      case "profile":
        return (
          <UserProfile />
        );


      default:
        return (
          <Dashboard />
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

          setPage(
            selectedPage
          );

          setDrawerOpen(
            false
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
            setPage(
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
            setPage(
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
            setPage(
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
            setPage(
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