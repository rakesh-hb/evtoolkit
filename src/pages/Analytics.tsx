function Analytics() {
  const sessions = JSON.parse(
    localStorage.getItem("evSessions") || "[]"
  );

  const totalSessions = sessions.length;

  const totalEnergy = sessions.reduce(
    (sum: number, s: any) => sum + s.energy,
    0
  );

  const totalCost = sessions.reduce(
    (sum: number, s: any) => sum + s.cost,
    0
  );

  const averageEnergy =
    totalSessions > 0
      ? totalEnergy / totalSessions
      : 0;

  const averageCost =
    totalSessions > 0
      ? totalCost / totalSessions
      : 0;

  const estimatedRange = totalEnergy * 6;

  const vehicleStats: Record<
    string,
    {
      sessions: number;
      energy: number;
      cost: number;
    }
  > = {};

  const stationStats: Record<
    string,
    {
      sessions: number;
      energy: number;
      cost: number;
    }
  > = {};

  const chargerStats: Record<
    string,
    number
  > = {};

  const monthlyStats: Record<
    string,
    {
      sessions: number;
      energy: number;
      cost: number;
    }
  > = {};

  const yearlyStats: Record<
    string,
    {
      sessions: number;
      energy: number;
      cost: number;
    }
  > = {};

  const weeklyStats: Record<
    string,
    number
  > = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  sessions.forEach((session: any) => {

    // Vehicle

    if (!vehicleStats[session.vehicle]) {

      vehicleStats[session.vehicle] = {
        sessions: 0,
        energy: 0,
        cost: 0,
      };

    }

    vehicleStats[session.vehicle].sessions++;
    vehicleStats[session.vehicle].energy +=
      session.energy;
    vehicleStats[session.vehicle].cost +=
      session.cost;

    // Station

    const station =
      session.station || "Home";

    if (!stationStats[station]) {

      stationStats[station] = {
        sessions: 0,
        energy: 0,
        cost: 0,
      };

    }

    stationStats[station].sessions++;
    stationStats[station].energy +=
      session.energy;
    stationStats[station].cost +=
      session.cost;

    // Charger

    chargerStats[session.charger] =
      (chargerStats[session.charger] || 0) + 1;

    // Date

    if (session.date) {

      const date =
        new Date(session.date);

      const month =
        date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

      const year =
        date.getFullYear().toString();

      const weekday =
        date.toLocaleString("default", {
          weekday: "long",
        });

      if (!monthlyStats[month]) {

        monthlyStats[month] = {
          sessions: 0,
          energy: 0,
          cost: 0,
        };

      }

      monthlyStats[month].sessions++;
      monthlyStats[month].energy +=
        session.energy;
      monthlyStats[month].cost +=
        session.cost;

      if (!yearlyStats[year]) {

        yearlyStats[year] = {
          sessions: 0,
          energy: 0,
          cost: 0,
        };

      }

      yearlyStats[year].sessions++;
      yearlyStats[year].energy +=
        session.energy;
      yearlyStats[year].cost +=
        session.cost;

      weeklyStats[weekday]++;

    }

  });

  return (
    <>
      <div className="welcome">
        <h2>📊 Analytics Dashboard</h2>
        <p>Detailed insights into your EV charging history.</p>
      </div>
  
      {/* KPI Cards */}
  
      <div className="statsGrid">
  
        <div className="statCard">
          <h3>Total Sessions</h3>
          <h1>{totalSessions}</h1>
        </div>
  
        <div className="statCard">
          <h3>Total Energy</h3>
          <h1>{totalEnergy.toFixed(1)} kWh</h1>
        </div>
  
        <div className="statCard">
          <h3>Total Spend</h3>
          <h1>₹{totalCost.toLocaleString()}</h1>
        </div>
  
        <div className="statCard">
          <h3>Average Cost</h3>
          <h1>₹{averageCost.toFixed(2)}</h1>
        </div>
  
        <div className="statCard">
          <h3>Average Energy</h3>
          <h1>{averageEnergy.toFixed(1)} kWh</h1>
        </div>
  
        <div className="statCard">
          <h3>Estimated Range</h3>
          <h1>{estimatedRange.toFixed(0)} km</h1>
        </div>
  
      </div>
  
      {/* Charging Overview */}
  
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
              <td>Total Spend</td>
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
  
            <tr>
              <td>Estimated Range Added</td>
              <td>{estimatedRange.toFixed(0)} km</td>
            </tr>
  
          </tbody>
  
        </table>
  
      </div>
  
      {/* Weekly Summary */}
  
      <div className="card">
  
        <h3>Weekly Summary</h3>
  
        <table className="table">
  
          <thead>
  
            <tr>
              <th>Day</th>
              <th>Sessions</th>
            </tr>
  
          </thead>
  
          <tbody>
  
            {Object.entries(weeklyStats).map(([day, count]) => (
  
              <tr key={day}>
                <td>{day}</td>
                <td>{count}</td>
              </tr>
  
            ))}
  
          </tbody>
  
        </table>
  
      </div>
  
      {/* Monthly Summary */}
  
      <div className="card">
  
        <h3>Monthly Summary</h3>
  
        <table className="table">
  
          <thead>
  
            <tr>
              <th>Month</th>
              <th>Sessions</th>
              <th>Energy</th>
              <th>Spend</th>
            </tr>
  
          </thead>
  
          <tbody>
  
            {Object.entries(monthlyStats).map(
              ([month, stats]) => (
  
                <tr key={month}>
  
                  <td>{month}</td>
  
                  <td>{stats.sessions}</td>
  
                  <td>
                    {stats.energy.toFixed(1)} kWh
                  </td>
  
                  <td>
                    ₹{stats.cost.toLocaleString()}
                  </td>
  
                </tr>
  
              )
            )}
  
          </tbody>
  
        </table>
  
      </div>

          {/* Vehicle Statistics */}

    <div className="card">

<h3>🚗 Vehicle Statistics</h3>

{Object.keys(vehicleStats).length === 0 ? (

  <p>No charging data available.</p>

) : (

  <table className="table">

    <thead>

      <tr>
        <th>Vehicle</th>
        <th>Sessions</th>
        <th>Energy</th>
        <th>Spend</th>
      </tr>

    </thead>

    <tbody>

      {Object.entries(vehicleStats).map(

        ([vehicle, stats]) => (

          <tr key={vehicle}>

            <td>{vehicle}</td>

            <td>{stats.sessions}</td>

            <td>{stats.energy.toFixed(1)} kWh</td>

            <td>₹{stats.cost.toLocaleString()}</td>

          </tr>

        )

      )}

    </tbody>

  </table>

)}

</div>


{/* Charging Station Statistics */}

<div className="card">

<h3>🏢 Charging Station Statistics</h3>

{Object.keys(stationStats).length === 0 ? (

  <p>No charging station data available.</p>

) : (

  <table className="table">

    <thead>

      <tr>
        <th>Station</th>
        <th>Sessions</th>
        <th>Energy</th>
        <th>Spend</th>
      </tr>

    </thead>

    <tbody>

      {Object.entries(stationStats).map(

        ([station, stats]) => (

          <tr key={station}>

            <td>{station}</td>

            <td>{stats.sessions}</td>

            <td>{stats.energy.toFixed(1)} kWh</td>

            <td>₹{stats.cost.toLocaleString()}</td>

          </tr>

        )

      )}

    </tbody>

  </table>

)}

</div>


{/* Charging Type */}

<div className="card">

<h3>🔌 Charging Type Distribution</h3>

<table className="table">

  <thead>

    <tr>
      <th>Charging Type</th>
      <th>Sessions</th>
    </tr>

  </thead>

  <tbody>

    {Object.entries(chargerStats).map(

      ([charger, count]) => (

        <tr key={charger}>

          <td>{charger}</td>

          <td>{count}</td>

        </tr>

      )

    )}

  </tbody>

</table>

</div>


{/* Yearly Summary */}

<div className="card">

<h3>📅 Yearly Summary</h3>

<table className="table">

  <thead>

    <tr>
      <th>Year</th>
      <th>Sessions</th>
      <th>Energy</th>
      <th>Spend</th>
    </tr>

  </thead>

  <tbody>

    {Object.entries(yearlyStats).map(

      ([year, stats]) => (

        <tr key={year}>

          <td>{year}</td>

          <td>{stats.sessions}</td>

          <td>{stats.energy.toFixed(1)} kWh</td>

          <td>₹{stats.cost.toLocaleString()}</td>

        </tr>

      )

    )}

  </tbody>

</table>

</div>


{/* Recent Charging Sessions */}

<div className="card">

<h3>📝 Recent Charging Sessions</h3>

{sessions.length === 0 ? (

  <p>No charging sessions found.</p>

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

      {sessions
        .slice()
        .reverse()
        .map((session: any) => (

          <tr key={session.id}>

            <td>{session.date}</td>

            <td>{session.vehicle}</td>

            <td>{session.station || "-"}</td>

            <td>{session.charger}</td>

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