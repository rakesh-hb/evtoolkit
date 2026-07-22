function Analytics() {
  const totalEnergy = 0;
  const totalCost = 0;
  const totalSessions = 0;
  const averageCost = 0;
  const averageEnergy = 0;

  return (
    <>
      <div className="welcome">
        <h2>📊 Analytics</h2>
        <p>Charging statistics and insights.</p>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <h3>Total Energy</h3>
          <h1>{totalEnergy} kWh</h1>
        </div>

        <div className="statCard">
          <h3>Total Cost</h3>
          <h1>₹{totalCost}</h1>
        </div>

        <div className="statCard">
          <h3>Sessions</h3>
          <h1>{totalSessions}</h1>
        </div>

        <div className="statCard">
          <h3>Average Cost</h3>
          <h1>₹{averageCost}</h1>
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
              <td>{totalEnergy} kWh</td>
            </tr>

            <tr>
              <td>Total Cost</td>
              <td>₹{totalCost}</td>
            </tr>

            <tr>
              <td>Average Cost / Session</td>
              <td>₹{averageCost}</td>
            </tr>

            <tr>
              <td>Average Energy / Session</td>
              <td>{averageEnergy} kWh</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Monthly Summary</h3>

        <p style={{ marginTop: 12, color: "#94a3b8" }}>
          Monthly charts and detailed reports will appear here once charging
          sessions are recorded.
        </p>
      </div>
    </>
  );
}

export default Analytics;