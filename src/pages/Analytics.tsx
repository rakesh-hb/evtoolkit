function Analytics() {
  const sessions = JSON.parse(
    localStorage.getItem("evSessions") || "[]"
  );

  const totalSessions = sessions.length;

  const totalEnergy = sessions.reduce(
    (sum: number, session: any) => sum + session.energy,
    0
  );

  const totalCost = sessions.reduce(
    (sum: number, session: any) => sum + session.cost,
    0
  );

  const averageCost =
    totalSessions > 0
      ? totalCost / totalSessions
      : 0;

  const averageEnergy =
    totalSessions > 0
      ? totalEnergy / totalSessions
      : 0;

  return (
    <>
      <div className="welcome">
        <h2>📊 Analytics</h2>
        <p>Charging statistics and insights.</p>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <h3>Total Energy</h3>
          <h1>{totalEnergy.toFixed(1)} kWh</h1>
        </div>

        <div className="statCard">
          <h3>Total Cost</h3>
          <h1>₹{totalCost.toLocaleString()}</h1>
        </div>

        <div className="statCard">
          <h3>Sessions</h3>
          <h1>{totalSessions}</h1>
        </div>

        <div className="statCard">
          <h3>Average Cost</h3>
          <h1>₹{averageCost.toFixed(2)}</h1>
        </div>
      </div>

      <div className="card">
        <h3>Charging Overview</h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Total Sessions</td>
              <td>{totalSessions}</td>
            </tr>

            <tr>
              <td>Total Energy</td>
              <td>{totalEnergy.toFixed(1)} kWh</td>
            </tr>

            <tr>
              <td>Total Cost</td>
              <td>₹{totalCost.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Average Cost / Session</td>
              <td>₹{averageCost.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Average Energy / Session</td>
              <td>{averageEnergy.toFixed(1)} kWh</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Recent Charging Sessions</h3>

        {totalSessions === 0 ? (
          <p
            style={{
              marginTop: 12,
              color: "#94a3b8",
            }}
          >
            No charging sessions recorded yet.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Station</th>
                <th>Energy</th>
                <th>Cost</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session: any) => (
                <tr key={session.id}>
                  <td>{session.date}</td>
                  <td>{session.vehicle}</td>
                  <td>{session.station || "-"}</td>
                  <td>{session.energy.toFixed(1)} kWh</td>
                  <td>₹{session.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Analytics;