import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { vehicles } from "../data/vehicles";

interface Session {
  id: number;
  vehicle: string;
  charger: string;
  energy: number;
  cost: number;
  station: string;
  date: string;
}

export interface ChargingStationOption {
  name: string;
  category:
    | "Home"
    | "Public"
    | "Office"
    | "Fleet"
    | "Highway"
    | "Commercial"
    | "OEM"
    | "Utility"
    | "Fuel Station"
    | "Other";
}

export const chargingStations: ChargingStationOption[] = [
  // -------------------------
  // Home
  // -------------------------
  { name: "Home Charging", category: "Home" },
  { name: "Home 3.3kw", category: "Home" },
  { name: "Home 7.2kw", category: "Home" },
  { name: "Home 7.4kw", category: "Home" },
  { name: "Home 11kw", category: "Home" },
  { name: "Home 22kw", category: "Home" },
  { name: "Apartment/Residential/Society Charger", category: "Home" },

  // -------------------------
  // Public CPOs
  // -------------------------
  { name: "Tata Power EZ Charge", category: "Public" },
  { name: "Statiq", category: "Public" },
  { name: "ChargeZone", category: "Public" },
  { name: "Jio-bp Pulse", category: "Public" },
  { name: "Bolt.Earth", category: "Public" },
  { name: "Kazam", category: "Public" },
  { name: "ThunderPlus", category: "Public" },
  { name: "ElectreeFi", category: "Public" },
  { name: "EV Dock", category: "Public" },
  { name: "ChargeMOD", category: "Public" },
  { name: "Glida", category: "Public" },
  { name: "Fortum Charge & Drive", category: "Public" },
  { name: "Relux Electric", category: "Public" },
  { name: "ElectricPe", category: "Public" },
  { name: "EVRE", category: "Public" },
  { name: "EV91", category: "Public" },
  { name: "PlugNGo", category: "Public" },
  { name: "GO EC", category: "Public" },

  // -------------------------
  // Fuel Retailers
  // -------------------------
  { name: "Indian Oil", category: "Fuel Station" },
  { name: "BPCL", category: "Fuel Station" },
  { name: "HPCL", category: "Fuel Station" },
  { name: "Shell Recharge", category: "Fuel Station" },

  // -------------------------
  // State Utilities
  // -------------------------
  { name: "BESCOM EV Mithra", category: "Utility" },
  //{ name: "KSEB", category: "Utility" },
  //{ name: "MSEDCL", category: "Utility" },
  //{ name: "TANGEDCO", category: "Utility" },
  //{ name: "UPPCL", category: "Utility" },
 // { name: "GUVNL", category: "Utility" },
 // { name: "WBSEDCL", category: "Utility" },
  //{ name: "TSNPDCL", category: "Utility" },
 // { name: "TSSPDCL", category: "Utility" },
  //{ name: "APSPDCL", category: "Utility" },
  //{ name: "APEPDCL", category: "Utility" },
  //{ name: "NTPC", category: "Utility" },
  //{ name: "NHPC", category: "Utility" },
  //{ name: "PowerGrid", category: "Utility" },
  //{ name: "EESL", category: "Utility" },

  // -------------------------
  // OEM Networks
  // -------------------------
  { name: "Ather Grid", category: "OEM" },
  { name: "Hyundai EV Charging", category: "OEM" },
  { name: "MG ChargeHub", category: "OEM" },
  { name: "Mahindra Charging", category: "OEM" },
  { name: "BYD Charging", category: "OEM" },
  { name: "BMW Charging", category: "OEM" },
  { name: "Mercedes-Benz Charging", category: "OEM" },
  { name: "Audi Charging", category: "OEM" },
  { name: "Kia EV Charging", category: "OEM" },
  { name: "Volvo Charging", category: "OEM" },

  // -------------------------
  // Office
  // -------------------------
  { name: "Office Charger", category: "Office" },

  // -------------------------
  // Commercial Locations
  // -------------------------
  { name: "Mall Charging", category: "Commercial" },
  { name: "Hotel/Restaurant Charging", category: "Commercial" },
  { name: "Airport Charging", category: "Commercial" },
  { name: "Metro Station Charging", category: "Commercial" },
  { name: "Hospital Charging", category: "Commercial" },

  // -------------------------
  // Generic
  // -------------------------
  { name: "Other", category: "Other" }
];

function Tracker() {

  const defaultVehicle =
    vehicles.find(v => v.model === "Curvv EV 55") ??
    vehicles[0];

  const [vehicle, setVehicle] = useState(
    `${defaultVehicle.brand} ${defaultVehicle.model}`
  );

  const [charger, setCharger] =
    useState("DC Fast");

  const [energy, setEnergy] =
    useState("");

  const [cost, setCost] =
    useState("");

  const [station, setStation] =
    useState("");

  const [date, setDate] =
    useState("");

    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
      loadSessions();
    }, []);
    
    async function loadSessions() {
      const { data, error } = await supabase
        .from("charging_sessions")
        .select("*")
        .order("date", { ascending: false });
    
      if (error) {
        console.error(error);
        return;
      }
    
      setSessions(data as Session[]);
    }


    const addSession = async () => {

      if (
        !vehicle ||
        !energy ||
        !cost ||
        !date
      ) {
        alert("Please fill all required fields.");
        return;
      }
    
      const newSession = {
        vehicle,
        charger,
        energy: Number(energy),
        cost: Number(cost),
        station,
        date,
      };
    
      const { data, error } = await supabase
        .from("charging_sessions")
        .insert([newSession])
        .select();
    
      if (error) {
        console.error(error);
        alert("Failed to save session");
        return;
      }
    
      setSessions((prev) => [
        ...(data as Session[]),
        ...prev,
      ]);
    
      // Reset form
      setVehicle(
        `${defaultVehicle.brand} ${defaultVehicle.model}`
      );
      setCharger("DC Fast");
      setEnergy("");
      setCost("");
      setStation("");
      setDate("");
    };

    const deleteSession = async (id: number) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this charging session?\n\nThis action cannot be undone."
      );
    
      if (!confirmed) {
        return;
      }
    
      const { error } = await supabase
        .from("charging_sessions")
        .delete()
        .eq("id", id);
    
      if (error) {
        console.error(error);
        alert("Failed to delete the charging session.");
        return;
      }
    
      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      );
    
      alert("Charging session deleted successfully.");
    };

    const resetForm = () => {
      const confirmed = window.confirm(
        "⚠️ Reset all entered values?\n\nAll unsaved information will be cleared."
      );
    
      if (!confirmed) return;
    
      setVehicle(`${defaultVehicle.brand} ${defaultVehicle.model}`);
      setCharger("DC Fast");
      setEnergy("");
      setCost("");
      setStation("");
      setDate("");
    };


  return (
    <>
      <div className="welcome">
        <h2>📝 Charge Tracker</h2>
        <p>Record and manage your EV charging sessions.</p>
      </div>
  
      <div className="card">
        <label>Vehicle</label>
  
        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
        >
          {vehicles.map((v) => (
            <option
              key={v.id}
              value={`${v.brand} ${v.model}`}
            >
              {v.brand} {v.model}
            </option>
          ))}
        </select>
  
        <label>Charging Type</label>
  
        <select
          value={charger}
          onChange={(e) => setCharger(e.target.value)}
        >
          <option>Home AC</option>
          <option>Public AC</option>
          <option>DC Fast</option>
        </select>
  
        <label>Energy Charged (kWh)</label>
  
        <input
          type="number"
          placeholder="Enter energy charged"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />
  
        <label>Charging Station</label>
  
        <select
          value={station}
          onChange={(e) => {
            setStation(e.target.value);
        }}
        >
          <option value="">
            Select Charging Station
          </option>
  
          {chargingStations.map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
  
        <label>Total Cost (₹)</label>
  
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
  
        <label>Date</label>
  
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
  
  <div className="buttonGroup">
  <button
    className="primaryButton"
    onClick={addSession}
  >
    💾 Save Session
  </button>

  <button
    className="dangerButton"
    onClick={resetForm}
  >
    🔄 Reset Form
  </button>
</div>

      </div>
  
      <div className="card">
        <h3>Recent Sessions</h3>
  
        {sessions.length === 0 ? (
  <p style={{ marginTop: 15 }}>
    No charging sessions recorded.
  </p>
) : (
  <div className="tableContainer">
    <table className="table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Date</th>
          <th>Vehicle</th>
          <th>Station</th>
          <th>Type</th>
          <th>Energy</th>
          <th>Cost</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {sessions.map((session, index) => (
          <tr key={session.id}>
            <td>{sessions.length - index}</td>
            <td>{session.date}</td>
            <td>{session.vehicle}</td>
            <td>{session.station || "-"}</td>
            <td>{session.charger}</td>
            <td>{session.energy.toFixed(1)} kWh</td>
            <td>₹{session.cost.toLocaleString()}</td>
            <td>
              <button
                onClick={() => deleteSession(session.id)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </>
  );

  }
  
  export default Tracker;