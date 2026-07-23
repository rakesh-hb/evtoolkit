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

const chargingStations = [
  { name: "Tata Power EZ", amount: 0 },
  { name: "Shell Recharge", amount: 0 },
  { name: "BESCOM EV Mithra", amount: 0 },
  { name: "Static", amount: 0 },
  { name: "ChargeZone", amount: 0 },
  { name: "Zeon", amount: 0 },
  { name: "BPCL", amount: 0 },
  { name: "Jio-bp Pulse", amount: 0 },
  { name: "EV Dock", amount: 0 },
  { name: "eHUB by MG", amount: 0 },
  { name: "Indian Oil", amount: 0 },
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
      setCharger("Home AC");
      setEnergy("");
      setCost("");
      setStation("");
      setDate("");
    };

    const deleteSession = async (id: number) => {

      if (!window.confirm("Delete this charging session?")) {
        return;
      }
    
      const { error } = await supabase
        .from("charging_sessions")
        .delete()
        .eq("id", id);
    
      if (error) {
        console.error(error);
        alert("Failed to delete session");
        return;
      }
    
      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      );
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
            const selected = chargingStations.find(
              (s) => s.name === e.target.value
            );
  
            setStation(e.target.value);
  
            if (selected) {
              setCost(selected.amount.toString());
            }
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
  
        <button
          className="primaryButton"
          onClick={addSession}
        >
          Save Session
        </button>
      </div>
  
      <div className="card">
        <h3>Recent Sessions</h3>
  
        {sessions.length === 0 ? (
          <p style={{ marginTop: 15 }}>
            No charging sessions recorded.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
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
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.date}</td>
  
                  <td>{session.vehicle}</td>
  
                  <td>
                    {session.station || "-"}
                  </td>
  
                  <td>{session.charger}</td>
  
                  <td>
                    {session.energy.toFixed(1)} kWh
                  </td>
  
                  <td>
                    ₹{session.cost.toLocaleString()}
                  </td>
  
                  <td>
                    <button
                      onClick={() =>
                        deleteSession(session.id)
                      }
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
        )}
      </div>
    </>
  );
  
  }
  
  export default Tracker;