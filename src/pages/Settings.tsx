import { useState } from "react";
import { createBackup } from "../services/backupService";

function Settings() {
  const [currency, setCurrency] = useState("INR (₹)");
  const [tariff, setTariff] = useState(7);
  const [distanceUnit, setDistanceUnit] = useState("km");

  return (
    <>
      <div className="welcome">
        <h2>⚙️ Settings</h2>
        <p>Customize your EV Toolkit preferences.</p>
      </div>

      <div className="card">
        <label>Currency</label>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option>INR (₹)</option>
        </select>

        <label>Default Electricity Tariff (₹/kWh)</label>

        <input
          type="number"
          value={tariff}
          min={0}
          step={0.1}
          onChange={(e) => setTariff(Number(e.target.value))}
        />

        <label>Distance Unit</label>

        <select
          value={distanceUnit}
          onChange={(e) => setDistanceUnit(e.target.value)}
        >
          <option>km</option>
          <option>mi</option>
        </select>
      </div>

      <div className="card">

      <div className="card">

  <h3>💾 Backup & Restore</h3>

  <p>
    Export all your EV Toolkit data into a single backup file or restore it
    later on any device.
  </p>

  <div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    alignItems: "center",
  }}
>
  <button
    className="primaryButton"
    onClick={() => void createBackup()}
  >
    📥 Create Backup
  </button>

  <button
    className="restoreButton"
    onClick={() => {
      // Restore logic
    }}
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
    Backup includes Charging History, Service History, Tyre History,
    Document Vault and future supported modules.
  </p>

</div>

        <h3>GST Information</h3>

        <p style={{ marginTop: 12 }}>
          • Home AC Charging : No GST
        </p>

        <p style={{ marginTop: 8 }}>
          • Public AC Charging : As per operator pricing
        </p>

        <p style={{ marginTop: 8 }}>
          • DC Fast Charging : 18% GST applied
        </p>
      </div>

      <div className="card">
        <h3>About</h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Application</td>
              <td>EV Toolkit</td>
            </tr>

            <tr>
              <td>Version</td>
              <td>3.0</td>
            </tr>

            <tr>
              <td>Platform</td>
              <td>React + Vite + TypeScript</td>
            </tr>

            <tr>
              <td>Database</td>
              <td>Supabase PostgreSQL</td>
            </tr>

            <tr>
              <td>Hosting</td>
              <td>Cloudflare Workers</td>
            </tr>

            <tr>
              <td>Storage</td>
              <td>Cloud Database</td>
            </tr>

            <tr>
              <td>Owner and Developer</td>
              <td>Rakesh HB</td>
            </tr>

          </tbody>
        </table>
      </div>
    </>
  );
}

export default Settings;