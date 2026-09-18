import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import UserDetails from "../components/UserDetails";


interface DashboardProps {
  onNavigate?: (page: string) => void;
}


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


function Dashboard({
  onNavigate,
}: DashboardProps) {
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
      {/* ======================================================
          HEADER / USER DETAILS
          ====================================================== */}

      <div
        style={{
          position: "relative",
          minHeight: 52,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
        }}
      >
        <UserDetails
          onClick={() => {
            onNavigate?.("profile");
          }}
        />
      </div>


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

      <div
        className="statsGrid"
        style={{
          gap: "14px",
        }}
      >

        {/* ==================================================
            TOTAL COST
            ================================================== */}

        <div
          className="statCard"
          style={{
            background:
              "linear-gradient(145deg, rgba(120,53,15,0.34), rgba(15,23,42,0.96))",
            border:
              "1px solid rgba(245,158,11,0.48)",
            borderRadius:
              "16px",
            boxShadow:
              "0 8px 24px rgba(245,158,11,0.22)",
            minHeight:
              "138px",
            minWidth:
              0,
            padding:
              "16px 10px",
            overflow:
              "hidden",
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap:
                "7px",
              marginBottom:
                "9px",
              minWidth:
                0,
            }}
          >

            <div
              style={{
                width:
                  "34px",
                height:
                  "34px",
                borderRadius:
                  "50%",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(145deg, #f59e0b, #d97706)",
                color:
                  "#ffffff",
                fontSize:
                  "18px",
                fontWeight:
                  800,
                boxShadow:
                  "0 0 18px rgba(245,158,11,0.22)",
                flexShrink:
                  0,
              }}
            >
              ₹
            </div>


            <h3
              style={{
                margin:
                  0,
                color:
                  "#f8fafc",
                fontFamily:
                  '"Inter", "Segoe UI", Arial, sans-serif',
                fontSize:
                  "12px",
                fontWeight:
                  750,
                lineHeight:
                  1.15,
                textAlign:
                  "center",
                whiteSpace:
                  "normal",
                overflowWrap:
                  "anywhere",
                minWidth:
                  0,
                flex:
                  "1 1 auto",
              }}
            >
              Total Cost
            </h3>

          </div>


          <h1
            style={{
              margin:
                0,
              color:
                "#fbbf24",
              fontFamily:
                '"Inter", "Segoe UI", Arial, sans-serif',
              fontSize:
                "23px",
              lineHeight:
                1.05,
              fontWeight:
                800,
              letterSpacing:
                "-0.035em",
              textAlign:
                "center",
              maxWidth:
                "100%",
              overflowWrap:
                "anywhere",
              textShadow:
                "0 0 18px rgba(245,158,11,0.22)",
              whiteSpace:
                "nowrap",
            }}
          >
            ₹{totalCost.toLocaleString(
              undefined,
              {
                minimumFractionDigits:
                  2,
                maximumFractionDigits:
                  2,
              }
            )}
          </h1>

        </div>


        {/* ==================================================
            TOTAL ENERGY
            ================================================== */}

        <div
          className="statCard"
          style={{
            background:
              "linear-gradient(145deg, rgba(6,95,70,0.34), rgba(15,23,42,0.96))",
            border:
              "1px solid rgba(34,197,94,0.48)",
            borderRadius:
              "16px",
            boxShadow:
              "0 8px 24px rgba(34,197,94,0.22)",
            minHeight:
              "138px",
            minWidth:
              0,
            padding:
              "16px 10px",
            overflow:
              "hidden",
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap:
                "7px",
              marginBottom:
                "9px",
              minWidth:
                0,
            }}
          >

            <div
              style={{
                width:
                  "34px",
                height:
                  "34px",
                borderRadius:
                  "50%",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(145deg, #22c55e, #16a34a)",
                color:
                  "#ffffff",
                fontSize:
                  "22px",
                fontWeight:
                  800,
                boxShadow:
                  "0 0 18px rgba(34,197,94,0.22)",
                flexShrink:
                  0,
              }}
            >
              ϟ
            </div>


            <h3
              style={{
                margin:
                  0,
                color:
                  "#f8fafc",
                fontFamily:
                  '"Inter", "Segoe UI", Arial, sans-serif',
                fontSize:
                  "12px",
                fontWeight:
                  750,
                lineHeight:
                  1.15,
                textAlign:
                  "center",
                whiteSpace:
                  "normal",
                overflowWrap:
                  "anywhere",
                minWidth:
                  0,
                flex:
                  "1 1 auto",
              }}
            >
              Total Energy
            </h3>

          </div>


          <h1
            style={{
              margin:
                0,
              color:
                "#4ade80",
              fontFamily:
                '"Inter", "Segoe UI", Arial, sans-serif',
              fontSize:
                "27px",
              lineHeight:
                1.05,
              fontWeight:
                800,
              letterSpacing:
                "-0.03em",
              textAlign:
                "center",
              maxWidth:
                "100%",
              overflowWrap:
                "anywhere",
              textShadow:
                "0 0 18px rgba(34,197,94,0.22)",
              whiteSpace:
                "nowrap",
            }}
          >
            {totalEnergy.toFixed(1)}{" "}
            <span
              style={{
                fontSize:
                  "0.68em",
                whiteSpace:
                  "nowrap",
              }}
            >
              kWh
            </span>
          </h1>

        </div>


        {/* ==================================================
            TOTAL SESSIONS
            ================================================== */}

        <div
          className="statCard"
          style={{
            background:
              "linear-gradient(145deg, rgba(30,64,175,0.30), rgba(15,23,42,0.96))",
            border:
              "1px solid rgba(59,130,246,0.48)",
            borderRadius:
              "16px",
            boxShadow:
              "0 8px 24px rgba(59,130,246,0.22)",
            minHeight:
              "138px",
            minWidth:
              0,
            padding:
              "16px 10px",
            overflow:
              "hidden",
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap:
                "7px",
              marginBottom:
                "9px",
              minWidth:
                0,
            }}
          >

            <div
              style={{
                width:
                  "34px",
                height:
                  "34px",
                borderRadius:
                  "50%",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "linear-gradient(145deg, #3b82f6, #2563eb)",
                color:
                  "#ffffff",
                fontSize:
                  "20px",
                fontWeight:
                  800,
                boxShadow:
                  "0 0 18px rgba(59,130,246,0.22)",
                flexShrink:
                  0,
              }}
            >
              ▦
            </div>


            <h3
              style={{
                margin:
                  0,
                color:
                  "#f8fafc",
                fontFamily:
                  '"Inter", "Segoe UI", Arial, sans-serif',
                fontSize:
                  "12px",
                fontWeight:
                  750,
                lineHeight:
                  1.15,
                textAlign:
                  "center",
                whiteSpace:
                  "normal",
                overflowWrap:
                  "anywhere",
                minWidth:
                  0,
                flex:
                  "1 1 auto",
              }}
            >
              Total Sessions
            </h3>

          </div>


          <h1
            style={{
              margin:
                0,
              color:
                "#38bdf8",
              fontFamily:
                '"Inter", "Segoe UI", Arial, sans-serif',
              fontSize:
                "32px",
              lineHeight:
                1.05,
              fontWeight:
                800,
              letterSpacing:
                "-0.03em",
              textAlign:
                "center",
              maxWidth:
                "100%",
              overflowWrap:
                "anywhere",
              textShadow:
                "0 0 18px rgba(59,130,246,0.22)",
            }}
          >
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