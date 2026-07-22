function Dashboard() {
  const totalCost = 0;
  const totalEnergy = 0;
  const sessions = 0;
  const rangeAdded = 0;
  const averageCost = 0;

  return (
    <>
      <div className="welcome">
        <h2>Welcome 👋</h2>
        <p>Manage your EV charging from one place.</p>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <h3>Total Cost</h3>
          <h1>₹{totalCost}</h1>
        </div>

        <div className="statCard">
          <h3>Energy</h3>
          <h1>{totalEnergy} kWh</h1>
        </div>

        <div className="statCard">
          <h3>Sessions</h3>
          <h1>{sessions}</h1>
        </div>

        <div className="statCard">
          <h3>Range Added</h3>
          <h1>{rangeAdded} km</h1>
        </div>
      </div>

      <div className="card">
        <h3>Charging Summary</h3>

        <table className="table">
          <tbody>
            <tr>
              <td>Total Sessions</td>
              <td>{sessions}</td>
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
              <td>Average Cost</td>
              <td>₹{averageCost}</td>
            </tr>

            <tr>
              <td>Range Added</td>
              <td>{rangeAdded} km</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>

        <p
          style={{
            marginTop: 12,
            color: "#94a3b8",
          }}
        >
          No charging sessions recorded yet.
        </p>
      </div>
    </>
  );
}

export default Dashboard;