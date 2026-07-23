import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Session {
  id: number;
  vehicle: string;
  charger: string;
  energy: number;
  cost: number;
  station: string;
  date: string;
}

function Dashboard() {
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
      console.error("Error loading sessions:", error);
      return;
    }

    setSessions(data as Session[]);
  }

  const totalSessions = sessions.length;

  const totalEnergy = sessions.reduce(
    (sum, item) => sum + item.energy,
    0
  );

  const totalCost = sessions.reduce(
    (sum, item) => sum + item.cost,
    0
  );

  const rangeAdded = sessions.reduce(
    (sum, item) => sum + item.energy * 6,
    0
  );

  const averageCost =
    totalSessions > 0
      ? totalCost / totalSessions
      : 0;

  const lastSession =
    totalSessions > 0
      ? sessions[0]
      : null;

  return (
    <>
      <div className="welcome">
        <h2>Welcome 👋</h2>
        <p>Manage your EV charging from one place.</p>
      </div>

      <div className="statsGrid">

        <div className="statCard">
          <h3>Total Cost</h3>
          <h1>₹{totalCost.toLocaleString()}</h1>
        </div>

        <div className="statCard">
          <h3>Energy</h3>
          <h1>{totalEnergy.toFixed(1)} kWh</h1>
        </div>

        <div className="statCard">
          <h3>Sessions</h3>
          <h1>{totalSessions}</h1>
        </div>

        <div className="statCard">
          <h3>Range Added</h3>
          <h1>{rangeAdded.toFixed(0)} km</h1>
        </div>

      </div>

      <div className="card">

        <h3>Charging Summary</h3>

        <table className="table">

          <tbody>

            <tr>
              <td>Total Sessions</td>
              <td>{totalSessions}</td>
            </tr>

            <tr>
              <td>Total Energy Charged</td>
              <td>{totalEnergy.toFixed(1)} kWh</td>
            </tr>

            <tr>
              <td>Total Spend</td>
              <td>₹{totalCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Average Cost / Session</td>
              <td>₹{averageCost.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Estimated Range Added</td>
              <td>{rangeAdded.toFixed(0)} km</td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="card">

        <h3>Recent Activity</h3>

        {lastSession ? (

          <table className="table">

            <tbody>

              <tr>
                <td>Vehicle</td>
                <td>{lastSession.vehicle}</td>
              </tr>

              <tr>
                <td>Date</td>
                <td>{lastSession.date}</td>
              </tr>

              <tr>
                <td>Charging Type</td>
                <td>{lastSession.charger}</td>
              </tr>

              <tr>
                <td>Station</td>
                <td>{lastSession.station || "-"}</td>
              </tr>

              <tr>
                <td>Energy</td>
                <td>{lastSession.energy.toFixed(1)} kWh</td>
              </tr>

              <tr>
                <td>Cost</td>
                <td>₹{lastSession.cost.toLocaleString()}</td>
              </tr>

            </tbody>

          </table>

        ) : (

          <p
            style={{
              marginTop: 12,
              color: "#94a3b8",
            }}
          >
            No charging sessions recorded yet.
          </p>

        )}

      </div>

    </>
  );
}

export default Dashboard;