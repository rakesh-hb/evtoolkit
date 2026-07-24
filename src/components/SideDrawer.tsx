interface SideDrawerProps {
    open: boolean;
    currentPage: string;
    onClose: () => void;
    onNavigate: (page: string) => void;
  }
  
  const menu = [
    {
        title: "Account",
        items: [
          { key: "login", icon: "👤", label: "Login" },
        ],
    },
    {
      title: "Maintenance",
      items: [
        { key: "service", icon: "🔧", label: "Service History" },
        { key: "tyres", icon: "🛞", label: "Tyre History" },
        { key: "insurance", icon: "🛡️", label: "Insurance" },
      ],
    },
    {
      title: "System",
      items: [
        { key: "settings", icon: "⚙️", label: "Settings" },
      ],
    },
  ];
  
  export default function SideDrawer({
    open,
    currentPage,
    onClose,
    onNavigate,
  }: SideDrawerProps) {
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
            overflowY: "auto",
            boxShadow: "2px 0 12px rgba(0,0,0,.2)",
          }}
        >
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
      </>
    );
  }