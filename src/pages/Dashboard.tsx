import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import UserDetails from "../components/UserDetails";
import { usePrimaryVehicle } from "../context/PrimaryVehicleContext";
import { getCustomVehicles, type CustomVehicleRecord } from "../services/customVehicleService";
import { vehicles } from "../data/vehicles";


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

  const {
    primaryVehicle,
    dashboardAlias,
    loading: primaryVehicleLoading,
  } = usePrimaryVehicle();

  const [customVehicles, setCustomVehicles] =
    useState<CustomVehicleRecord[]>([]);

  useEffect(() => {
    async function loadCustomVehicles() {
      try {
        const data = await getCustomVehicles();
        setCustomVehicles(data);
      } catch (error) {
        console.error(
          "Error loading custom vehicles for dashboard:",
          error
        );
        setCustomVehicles([]);
      }
    }

    void loadCustomVehicles();
  }, []);


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

  const primaryVehicleName = useMemo(() => {
    if (!primaryVehicle) {
      return "";
    }

    if (primaryVehicle.type === "built_in") {
      const vehicle = vehicles.find(
        (item) => Number(item.id) === Number(primaryVehicle.id)
      );

      return vehicle
        ? `${vehicle.brand} ${vehicle.model}`
        : "";
    }

    const vehicle = customVehicles.find(
      (item) => Number(item.id) === Number(primaryVehicle.id)
    );

    return vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : "";
  }, [primaryVehicle, customVehicles]);

  const primaryVehicleSessions = useMemo(() => {
    if (!primaryVehicleName) {
      return [];
    }

    return sessions.filter(
      (session) =>
        session.vehicle.trim().toLowerCase() ===
        primaryVehicleName.trim().toLowerCase()
    );
  }, [sessions, primaryVehicleName]);

  const primaryVehicleTotalEnergy =
    primaryVehicleSessions.reduce(
      (sum, item) => sum + item.energy,
      0
    );

  const primaryVehicleTotalCost =
    primaryVehicleSessions.reduce(
      (sum, item) => sum + item.cost,
      0
    );


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


      {/* ======================================================
          PRIMARY VEHICLE
          ====================================================== */}

      <div
        className="card"
        style={{
          marginBottom: "18px",
          padding: "20px",
          fontFamily: '"Avenir Next", "Montserrat", "Inter", "Segoe UI", Arial, sans-serif',
          borderRadius: "18px",
          border: "1px solid rgba(249,115,22,0.42)",
          background:
            "linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
          boxShadow: "0 10px 30px rgba(15,23,42,0.28)",
          overflow: "hidden",
        }}
      >
        {primaryVehicleLoading ? (
          <p style={{ margin: 0, color: "#94a3b8" }}>
            Loading your Primary Vehicle...
          </p>
        ) : primaryVehicle && primaryVehicleName ? (
          <>
            <div
              style={{
                color: "#f97316",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              ⚡ Primary Vehicle
            </div>

            {dashboardAlias ? (
              <>
                <div
                  style={{
                    marginTop: "6px",
                    color: "#ffffff",
                    fontFamily: '"Avenir Next", "Montserrat", "Inter", "Segoe UI", Arial, sans-serif',
                    fontSize: "clamp(24px, 5vw, 34px)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                    overflowWrap: "anywhere",
                  }}
                >
                  {dashboardAlias}
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    color: "#cbd5e1",
                    fontFamily: '"Avenir Next", "Montserrat", "Inter", "Segoe UI", Arial, sans-serif',
                    fontSize: "clamp(14px, 3vw, 18px)",
                    fontWeight: 500,
                    lineHeight: 1.3,
                    overflowWrap: "anywhere",
                  }}
                >
                  ({primaryVehicleName})
                </div>
              </>
            ) : (
              <div
                style={{
                  marginTop: "6px",
                  color: "#ffffff",
                  fontFamily: '"Avenir Next", "Montserrat", "Inter", "Segoe UI", Arial, sans-serif',
                  fontSize: "clamp(24px, 5vw, 34px)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  overflowWrap: "anywhere",
                }}
              >
                {primaryVehicleName}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(110px, 1fr))",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Sessions
                </div>
                <strong style={{ color: "#38bdf8", fontSize: "20px" }}>
                  {primaryVehicleSessions.length}
                </strong>
              </div>

              <div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Energy
                </div>
                <strong style={{ color: "#4ade80", fontSize: "20px" }}>
                  {primaryVehicleTotalEnergy.toFixed(1)} kWh
                </strong>
              </div>

              <div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Charging Cost
                </div>
                <strong style={{ color: "#fbbf24", fontSize: "20px" }}>
                  ₹{primaryVehicleTotalCost.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>
            </div>

            <p
              style={{
                margin: "14px 0 0",
                color: "#cbd5e1",
                fontSize: "13px",
              }}
            >
              Your Primary Vehicle is used as the default vehicle across
              EV Toolkit.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                color: "#f97316",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}
            >
              ⚡ Primary Vehicle
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              No Primary Vehicle Selected
            </div>

            <p
              style={{
                margin: "8px 0 14px",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              Select your vehicle in Settings to personalise your
              Dashboard and use it as the default across the app.
            </p>

            <button
              type="button"
              onClick={() => onNavigate?.("settings")}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "10px 14px",
                background: "#f97316",
                color: "#ffffff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Go to Settings
            </button>
          </>
        )}
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