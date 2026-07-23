import { supabase } from "../lib/supabase";

import { useState } from "react";

function Settings() {
  const [currency, setCurrency] = useState("INR (₹)");
  const [tariff, setTariff] = useState(8);
  const [distanceUnit, setDistanceUnit] = useState("km");

  const resetData = async () => {
    if (!window.confirm("Delete all charging sessions?")) {
      return;
    }
  
    const { error } = await supabase
      .from("charging_sessions")
      .delete()
      .neq("id", 0);
  
    if (error) {
      console.error(error);
      alert("Failed to delete charging data.");
      return;
    }
  
    alert("All charging sessions have been deleted.");
  };

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
        <h3>Storage</h3>

        <button
          className="primaryButton"
          onClick={resetData}
        >
          Reset All Data
        </button>
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
              <td>2.0</td>
            </tr>

            <tr>
              <td>Platform</td>
              <td>React + Vite</td>
            </tr>

            <tr>
              <td>Storage</td>
              <td>Supabase Cloud Database</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Settings;