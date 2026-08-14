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
  user_id: string;
}

function Dashboard() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);

    try {
      /*
       * =========================================================
       * FAMILY DATA
       * =========================================================
       *
       * Do NOT filter by user_id here.
       *
       * The Supabase RLS policy on charging_sessions controls
       * which records the logged-in user is allowed to see.
       *
       * Therefore:
       *
       *   Rakesh  -> Rakesh + family members
       *   Sushma  -> Sushma + family members
       *
       * Records belonging to users outside the family remain
       * inaccessible because of RLS.
       */

      const {
        data,
        error,
      } = await supabase
        .from("charging_sessions")
        .select("*")
        .order("date", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading family charging sessions:",
          error
        );

        setSessions([]);

        return;
      }


      setSessions(
        (data ?? []).map((row) => ({
          id: row.id,

          vehicle:
            row.vehicle ?? "",

          charger:
            row.charger ?? "",

          energy:
            Number(row.energy ?? 0),

          cost:
            Number(row.cost ?? 0),

          station:
            row.station ?? "",

          date:
            row.date ?? "",

          user_id:
            row.user_id,
        }))
      );

    } catch (error) {
      console.error(
        "Error loading dashboard:",
        error
      );

      setSessions([]);

    } finally {
      setLoading(false);
    }
  }


  /*
   * ============================================================
   * FAMILY-WIDE CALCULATIONS
   * ============================================================
   */

  const totalSessions =
    sessions.length;


  const totalEnergy =
    sessions.reduce(
      (sum, item) =>
        sum + item.energy,
      0
    );


  const totalCost =
    sessions.reduce(
      (sum, item) =>
        sum + item.cost,
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

        <h2>
          Welcome 👋
        </h2>

        <p>
          Manage your EV charging
          from one place.
        </p>

      </div>


      {/* ======================================================
          FAMILY-WIDE STATS
          ====================================================== */}

      <div className="statsGrid">

        <div className="statCard">

          <h3>
            Total Cost
          </h3>

          <h1>
            ₹
            {totalCost.toLocaleString()}
          </h1>

        </div>


        <div className="statCard">

          <h3>
            Energy
          </h3>

          <h1>
            {totalEnergy.toFixed(1)}
            {" "}
            kWh
          </h1>

        </div>


        <div className="statCard">

          <h3>
            Sessions
          </h3>

          <h1>
            {totalSessions}
          </h1>

        </div>

      </div>


      {/* ======================================================
          CHARGING SUMMARY
          ====================================================== */}

      <div className="card">

        <h3>
          Charging Summary
        </h3>


        {loading ? (

          <p
            style={{
              marginTop: 12,
              color: "#94a3b8",
            }}
          >
            Loading family charging
            data...
          </p>

        ) : (

          <table className="table">

            <tbody>

              <tr>

                <td>
                  Total Sessions
                </td>

                <td>
                  {totalSessions}
                </td>

              </tr>


              <tr>

                <td>
                  Total Energy Charged
                </td>

                <td>
                  {totalEnergy.toFixed(1)}
                  {" "}
                  kWh
                </td>

              </tr>


              <tr>

                <td>
                  Total Spend
                </td>

                <td>
                  ₹
                  {totalCost.toLocaleString()}
                </td>

              </tr>


              <tr>

                <td>
                  Average Cost / Session
                </td>

                <td>
                  ₹
                  {averageCost.toFixed(2)}
                </td>

              </tr>

            </tbody>

          </table>

        )}

      </div>


      {/* ======================================================
          RECENT FAMILY ACTIVITY
          ====================================================== */}

      <div className="card">

        <h3>
          Recent Family Activity
        </h3>


        {loading ? (

          <p
            style={{
              marginTop: 12,
              color: "#94a3b8",
            }}
          >
            Loading...
          </p>

        ) : lastSession ? (

          <table className="table">

            <tbody>

              <tr>

                <td>
                  Vehicle
                </td>

                <td>
                  {lastSession.vehicle}
                </td>

              </tr>


              <tr>

                <td>
                  Date
                </td>

                <td>
                  {lastSession.date}
                </td>

              </tr>


              <tr>

                <td>
                  Charging Type
                </td>

                <td>
                  {lastSession.charger}
                </td>

              </tr>


              <tr>

                <td>
                  Station
                </td>

                <td>
                  {lastSession.station ||
                    "-"}
                </td>

              </tr>


              <tr>

                <td>
                  Energy
                </td>

                <td>
                  {lastSession.energy.toFixed(
                    1
                  )}
                  {" "}
                  kWh
                </td>

              </tr>


              <tr>

                <td>
                  Cost
                </td>

                <td>
                  ₹
                  {lastSession.cost.toLocaleString()}
                </td>

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
            No charging sessions
            recorded yet.
          </p>

        )}

      </div>
    </>
  );
}

export default Dashboard;