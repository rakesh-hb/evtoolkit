export default function About() {
    return (
      <>
        <div className="welcome">
          <h2>⚡ About EV Toolkit</h2>
          <p>Your personal EV ownership companion.</p>
        </div>
  
        <div className="card">
          <h3>🚗 What is EV Toolkit?</h3>
  
          <p>
            EV Toolkit is designed to help EV owners manage and track
            their complete EV ownership experience in one place.
          </p>
  
          <p>
            From charging and service history to tyres, insurance,
            documents, analytics, and ownership planning, EV Toolkit
            keeps your important vehicle information organised and
            easily accessible.
          </p>
        </div>
  
        <div className="card">
          <h3>⚡ What You Can Manage</h3>
  
          <ul
            style={{
              lineHeight: "2",
              paddingLeft: "22px",
              marginBottom: 0,
            }}
          >
            <li>🔋 Charging sessions and charging costs</li>
            <li>📍 Charging stations</li>
            <li>🔧 Service and maintenance history</li>
            <li>🛞 Tyre history and warranty information</li>
            <li>🛡️ Insurance policies and claims</li>
            <li>📁 Vehicle documents and receipts</li>
            <li>📊 EV ownership analytics</li>
            <li>⚡ EV planning and tracking</li>
            <li>💾 Backup and restore</li>
          </ul>
        </div>
  
        <div className="card">
          <h3>🔐 Privacy & Security</h3>
  
          <p style={{ marginBottom: 0 }}>
            Your data is associated with your account and protected
            using authentication and database-level security policies.
            Each user can access only their own records.
          </p>
        </div>
  
        <div className="card">
          <h3>🎯 Our Goal</h3>
  
          <p style={{ marginBottom: 0 }}>
            EV Toolkit aims to make EV ownership simpler by bringing
            charging, maintenance, costs, documents, insurance, and
            vehicle information together in one easy-to-use application.
          </p>
        </div>
  
        <div className="card">
          <h3>📱 Application</h3>
  
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <strong>Application</strong>
            <span>EV Toolkit</span>
  
            <strong>Version</strong>
            <span>1.0</span>
  
            <strong>Platform</strong>
            <span>Web Application</span>
          </div>
        </div>
  
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "12px",
            margin: "24px 0 40px",
          }}
        >
          ⚡ EV Toolkit
          <br />
          Built for a smarter EV ownership experience.
        </div>
      </>
    );
  }