import { useState } from "react";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { useAuth } from "./context/AuthContext";

import SideDrawer from "./components/SideDrawer";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Tracker from "./pages/Tracker";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import ServiceHistory from "./pages/ServiceHistory";
import TyreHistory from "./pages/TyreHistory";
import Insurance from "./pages/Insurance";
import DocumentVault from "./pages/DocumentVault";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";

function App() {
  const { session, loading } =
    useAuth();

  const [page, setPage] =
    useState("dashboard");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [authPage, setAuthPage] =
    useState<"login" | "forgot">(
      "login"
    );

  const isResetPassword =
    window.location.pathname ===
    "/reset-password";

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
   * Password recovery must be handled
   * before the normal login check.
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
   * Not authenticated
   */
  if (!session) {
    if (authPage === "forgot") {
      return (
        <ForgotPassword
          onBack={() =>
            setAuthPage("login")
          }
        />
      );
    }

    return (
      <Login
        onForgotPassword={() =>
          setAuthPage("forgot")
        }
      />
    );
  }

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "planner":
        return <Planner />;

      case "tracker":
        return <Tracker />;

      case "analytics":
        return <Analytics />;

      case "service":
        return <ServiceHistory />;

      case "tyres":
        return <TyreHistory />;

      case "insurance":
        return <Insurance />;

      case "documents":
        return <DocumentVault />;

      case "settings":
        return <Settings />;

      case "about":
        return <About />;

      case "profile":
        return <UserProfile />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <>
      <SideDrawer
        open={drawerOpen}
        currentPage={page}
        onClose={() =>
          setDrawerOpen(false)
        }
        onNavigate={(selectedPage) => {
          setPage(selectedPage);
        }}
      />

      <main className="content">
        {renderPage()}
      </main>

      <nav className="bottomNav">
        <button
          className={
            page === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("dashboard")
          }
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        <button
          className={
            page === "planner"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("planner")
          }
        >
          <span>⚡</span>
          <span>Planner</span>
        </button>

        <button
          className={
            page === "tracker"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("tracker")
          }
        >
          <span>🔋</span>
          <span>Charging</span>
        </button>

        <button
          className={
            page === "analytics"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("analytics")
          }
        >
          <span>📊</span>
          <span>Analytics</span>
        </button>

        <button
          onClick={() =>
            setDrawerOpen(true)
          }
        >
          <span>☰</span>
          <span>More</span>
        </button>
      </nav>
    </>
  );
}

export default App;