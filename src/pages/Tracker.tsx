import { useState } from "react";
import { vehicles } from "../data/vehicles";

interface Session {
  vehicle: string;
  charger: string;
  energy: number;
  cost: number;
  station: string;
  date: string;
}

const chargingStations = [
  { name: "Tata Power EZ", amount: 12541 },
  { name: "Shell Recharge", amount: 3447 },
  { name: "BESCOM EV Mithra", amount: 2564 },
  { name: "Static", amount: 1315 },
  { name: "ChargeZone", amount: 845 },
  { name: "Zeon", amount: 0 },
  { name: "BPCL", amount: 853 },
  { name: "Jio-bp Pulse", amount: 2000 },
  { name: "EV Dock", amount: 1096 },
  { name: "eHUB by MG", amount: 0 },
  { name: "Indian Oil", amount: 0 },
];

function Tracker() {
  const defaultVehicle =
    vehicles.find((v) => v.model === "Curvv EV 55") ?? vehicles[0];

  const [vehicle, setVehicle] = useState(
    `${defaultVehicle.brand} ${defaultVehicle.model}`
  );

  const [charger, setCharger] = useState("Home AC");
  const [energy, setEnergy] = useState("");
  const [cost, setCost] = useState("");
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");

  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = () => {
    if (!vehicle || !energy || !cost || !date) {
      alert("Please fill all required fields.");
      return;
    }

    const newSession: Session = {
      vehicle,
      charger,
      energy: Number(energy),
      cost: Number(cost),
      station,
      date,
    };

    setSessions([newSession, ...sessions]);

    setVehicle(`${defaultVehicle.brand} ${defaultVehicle.model}`);
    setCharger("Home AC");
    setEnergy("");
    setCost("");
    setStation("");
    setDate("");
  };

  return (
    <>
      <div className="welcome">
        <h2>📝 Charge Tracker</h2>
        <p>Record your EV charging sessions.</p>
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
          placeholder="Enter kWh"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />

        <label>Charging Station</label>
        <select
          value={station}
          onChange={(e) => {
            const selected = chargingStations.find(
              (item) => item.name === e.target.value
            );

            setStation(e.target.value);

            if (selected) {
              setCost(selected.amount.toString());
            }
          }}
        >
          <option value="">Select Charging Station</option>

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
          <p style={{ marginTop: 12 }}>
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
              </tr>
            </thead>

            <tbody>
              {sessions.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.vehicle}</td>
                  <td>{item.station || "-"}</td>
                  <td>{item.charger}</td>
                  <td>{item.energy} kWh</td>
                  <td>₹{item.cost.toLocaleString()}</td>
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