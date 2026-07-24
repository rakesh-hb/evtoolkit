import SideDrawer from "./components/SideDrawer";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Tracker from "./pages/Tracker";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import ServiceHistory from "./pages/ServiceHistory";
import TyreHistory from "./pages/TyreHistory";
import Insurance from "./pages/Insurance";

function App() {
  const [page, setPage] = useState("dashboard");

  const [drawerOpen, setDrawerOpen] = useState(false);

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

      case "service":
        return <ServiceHistory />;

      case "tyres":
        return <TyreHistory />;

      case "insurance":
        return <Insurance />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
<header
  className="header"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
<button
  onClick={() => setDrawerOpen(true)}
  style={{
    border: "none",
    background: "transparent",
    color: "#ffffff",
    fontSize: "28px",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  ☰
</button>

  <h2 style={{ margin: 0 }}>⚡ EV Toolkit</h2>

  <div style={{ width: 24 }} />
</header>

<SideDrawer
  open={drawerOpen}
  currentPage={page}
  onClose={() => setDrawerOpen(false)}
  onNavigate={setPage}
/>

      <main className="content">
      {renderPage()}

</main>
<nav className="bottomNav">
  <button
    className={page === "dashboard" ? "active" : ""}
    onClick={() => setPage("dashboard")}
  >
    🏠
    <span>Home</span>
  </button>

  <button
    className={page === "planner" ? "active" : ""}
    onClick={() => setPage("planner")}
  >
    ⚡
    <span>Planner</span>
  </button>

  <button
    className={page === "tracker" ? "active" : ""}
    onClick={() => setPage("tracker")}
  >
    🔋
    <span>Charging</span>
  </button>

  <button
    className={page === "analytics" ? "active" : ""}
    onClick={() => setPage("analytics")}
  >
    📊
    <span>Analytics</span>
  </button>

  <button onClick={() => setDrawerOpen(true)}>
    ☰
    <span>More</span>
  </button>
</nav>
    </div>
  );
}

export default App;