import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";

interface SideDrawerProps {
  open: boolean;
  currentPage: string;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const menu = [
  {
    title: "Maintenance",
    items: [
      { key: "service", icon: "🔧", label: "Service History" },
      { key: "tyres", icon: "🛞", label: "Tyre History" },
      { key: "documents", icon: "📁", label: "Document Vault" },
      { key: "insurance", icon: "🛡️", label: "Insurance" },
    ],
  },
  {
    title: "System",
    items: [{ key: "settings", icon: "⚙️", label: "Settings" }],
  },
];

export default function SideDrawer({
  open,
  currentPage,
  onClose,
  onNavigate,
}: SideDrawerProps) {
  const { session } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            zIndex: 1000,
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : -280,
          width: 260,
          height: "100vh",
          background: "#ffffff",
          color: "#222",
          borderRight: "1px solid #ddd",
          transition: "0.25s",
          zIndex: 1001,
          boxShadow: "2px 0 12px rgba(0,0,0,.2)",

          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 20,
            fontSize: 22,
            fontWeight: "bold",
            borderBottom: "1px solid #eee",
          }}
        >
          ⚡ EV Toolkit
        </div>

        {/* Menu */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {menu.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  padding: "14px 18px 8px",
                  color: "#777",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {section.title}
              </div>

              {section.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background:
                      currentPage === item.key ? "#eef5ff" : "white",
                    padding: "14px 18px",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* User Profile */}
<div
  style={{
    borderTop: "1px solid #eee",
    padding: 20,
    background: "#fafafa",
    textAlign: "center",
  }}
>
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "#2563eb",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      fontWeight: "bold",
      margin: "0 auto 12px",
    }}
  >
    {(session?.user.email?.charAt(0) ?? "U").toUpperCase()}
  </div>

  <div
    style={{
      fontWeight: 600,
      fontSize: 16,
      marginBottom: 4,
    }}
  >
    {session?.user.user_metadata?.full_name || "EV Toolkit User"}
  </div>

  <div
    style={{
      fontSize: 13,
      color: "#666",
      wordBreak: "break-word",
      marginBottom: 20,
    }}
  >
    {session?.user.email}
  </div>

  <button
    className="deleteButton"
    style={{ width: "100%" }}
    onClick={async () => {
      try {
        await signOut();
        onClose();
      } catch (error) {
        console.error(error);
        alert("Failed to logout.");
      }
    }}
  >
    🚪 Logout
  </button>
</div>
      </div>
    </>
  );
}