import { useState } from "react";

import Planner from "./pages/Planner";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/Tracker";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "planner":
        return <Planner />;

      case "tracker":
        return <Tracker />;

      case "analytics":
        return <Analytics />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">⚡ EV Toolkit</header>

      <main className="content">{renderPage()}</main>

      <nav className="bottomNav">
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          <span style={{ fontSize: 20 }}>🏠</span>
          <span>Home</span>
        </button>

        <button
          className={page === "planner" ? "active" : ""}
          onClick={() => setPage("planner")}
        >
          <span style={{ fontSize: 20 }}>⚡</span>
          <span>Planner</span>
        </button>

        <button
          className={page === "tracker" ? "active" : ""}
          onClick={() => setPage("tracker")}
        >
          <span style={{ fontSize: 20 }}>📝</span>
          <span>Tracker</span>
        </button>

        <button
          className={page === "analytics" ? "active" : ""}
          onClick={() => setPage("analytics")}
        >
          <span style={{ fontSize: 20 }}>📊</span>
          <span>Analytics</span>
        </button>

        <button
          className={page === "settings" ? "active" : ""}
          onClick={() => setPage("settings")}
        >
          <span style={{ fontSize: 20 }}>⚙️</span>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;