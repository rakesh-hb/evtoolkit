import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import UserDetails from "../components/UserDetails";
import {
  getCurrentPlan,
  type SubscriptionPlan,
} from "../services/subscriptionService";

const ReportToolbar = lazy(
  () => import("../components/reports/ReportToolbar")
);

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


interface Session {
  id: number;
  user_id?: string;
  vehicle: string;
  charger: string;
  energy: number;
  cost: number;
  station: string;
  date: string;
}


interface SummaryStats {
  sessions: number;
  energy: number;
  cost: number;
}


type ExpandedChart =
  | "monthlySpend"
  | "monthlyEnergy"
  | "weeklyActivity"
  | "chargingType"
  | null;


interface AnalyticsProps {
  onNavigate?: (page: string) => void;
}


function Analytics({
  onNavigate,
}: AnalyticsProps) {

  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [expandedChart, setExpandedChart] =
    useState<ExpandedChart>(null);

  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>("free");

  const [subscriptionLoading, setSubscriptionLoading] =
    useState(true);


  /*
   * ============================================================
   * LOAD CHARGING SESSIONS
   * ============================================================
   */

  useEffect(() => {
    loadSessions();
    loadSubscriptionPlan();
  }, []);

  async function loadSubscriptionPlan() {
    try {
      const plan = await getCurrentPlan();
      setSubscriptionPlan(plan);
    } catch (error) {
      console.error(
        "Failed to load subscription plan:",
        error
      );
      setSubscriptionPlan("free");
    } finally {
      setSubscriptionLoading(false);
    }
  }


  async function loadSessions() {

    setLoading(true);

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
        "Failed to load charging sessions:",
        error
      );

      setLoading(false);

      return;
    }


    setSessions(
      (data as Session[]) || []
    );

    setLoading(false);
  }


  /*
   * ============================================================
   * BASIC SUMMARY
   * ============================================================
   */

  const totalSessions =
    sessions.length;


  const totalEnergy =
    sessions.reduce(
      (sum, session) =>
        sum + session.energy,
      0
    );


  const totalCost =
    sessions.reduce(
      (sum, session) =>
        sum + session.cost,
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


  /*
   * ============================================================
   * STATISTICS
   * ============================================================
   */

  const vehicleStats:
    Record<string, SummaryStats> =
      {};


  const stationStats:
    Record<string, SummaryStats> =
      {};


  const monthlyStats:
    Record<string, SummaryStats> =
      {};


  const yearlyStats:
    Record<string, SummaryStats> =
      {};


  const chargerStats:
    Record<string, number> =
      {};


  /*
   * ============================================================
   * WEEKLY STATISTICS
   * ============================================================
   */

  const weeklyStats:
    Record<string, number> = {

      Sunday: 0,

      Monday: 0,

      Tuesday: 0,

      Wednesday: 0,

      Thursday: 0,

      Friday: 0,

      Saturday: 0,

    };


  /*
   * ============================================================
   * PROCESS CHARGING SESSIONS
   * ============================================================
   */

  sessions.forEach(
    (session) => {

      /*
       * --------------------------------------------------------
       * VEHICLE
       * --------------------------------------------------------
       */

      if (
        !vehicleStats[
          session.vehicle
        ]
      ) {

        vehicleStats[
          session.vehicle
        ] = {

          sessions: 0,

          energy: 0,

          cost: 0,

        };

      }


      vehicleStats[
        session.vehicle
      ].sessions++;


      vehicleStats[
        session.vehicle
      ].energy +=
        session.energy;


      vehicleStats[
        session.vehicle
      ].cost +=
        session.cost;


      /*
       * --------------------------------------------------------
       * STATION
       * --------------------------------------------------------
       */

      const station =
        session.station ||
        "Home";


      if (
        !stationStats[station]
      ) {

        stationStats[station] = {

          sessions: 0,

          energy: 0,

          cost: 0,

        };

      }


      stationStats[
        station
      ].sessions++;


      stationStats[
        station
      ].energy +=
        session.energy;


      stationStats[
        station
      ].cost +=
        session.cost;


      /*
       * --------------------------------------------------------
       * CHARGER
       * --------------------------------------------------------
       */

      const charger =
        session.charger ||
        "Unknown";


      if (
        !chargerStats[
          charger
        ]
      ) {

        chargerStats[
          charger
        ] = 0;

      }


      chargerStats[
        charger
      ]++;


      /*
       * --------------------------------------------------------
       * DATE
       * --------------------------------------------------------
       */

      const date =
        new Date(
          session.date
        );


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        /*
         * ------------------------------------------------------
         * MONTH
         * ------------------------------------------------------
         */

        const month =
          date.toLocaleString(
            "default",
            {
              month: "short",
              year: "numeric",
            }
          );


        if (
          !monthlyStats[
            month
          ]
        ) {

          monthlyStats[
            month
          ] = {

            sessions: 0,

            energy: 0,

            cost: 0,

          };

        }


        monthlyStats[
          month
        ].sessions++;


        monthlyStats[
          month
        ].energy +=
          session.energy;


        monthlyStats[
          month
        ].cost +=
          session.cost;


        /*
         * ------------------------------------------------------
         * YEAR
         * ------------------------------------------------------
         */

        const year =
          String(
            date.getFullYear()
          );


        if (
          !yearlyStats[
            year
          ]
        ) {

          yearlyStats[
            year
          ] = {

            sessions: 0,

            energy: 0,

            cost: 0,

          };

        }


        yearlyStats[
          year
        ].sessions++;


        yearlyStats[
          year
        ].energy +=
          session.energy;


        yearlyStats[
          year
        ].cost +=
          session.cost;


        /*
         * ------------------------------------------------------
         * WEEKDAY
         * ------------------------------------------------------
         */

        const weekday =
          date.toLocaleString(
            "default",
            {
              weekday: "long",
            }
          );


        if (
          weeklyStats[
            weekday
          ] !== undefined
        ) {

          weeklyStats[
            weekday
          ]++;

        }

      }

    }
  );


  /*
   * ============================================================
   * MONTHLY CHART DATA
   *
   * Newest month -> oldest month
   * ============================================================
   */

  const monthlyChartData =
    Object.entries(
      monthlyStats
    )
      .map(
        (
          [
            month,
            stats,
          ]
        ) => {

          const parsedDate =
            new Date(
              `1 ${month}`
            );

          return {

            month,

            sessions:
              stats.sessions,

            energy:
              stats.energy,

            cost:
              stats.cost,

            sortDate:
              parsedDate.getTime(),

          };

        }
      )
      .sort(
        (a, b) =>
          b.sortDate -
          a.sortDate
      );


  /*
   * ============================================================
   * MONTHLY SUMMARY DATA
   * ============================================================
   */

  const monthlySummaryData =
    [...monthlyChartData];


  /*
   * ============================================================
   * YEARLY SUMMARY DATA
   * ============================================================
   */

  const yearlySummaryData =
    Object.entries(
      yearlyStats
    )
      .map(
        (
          [
            year,
            stats,
          ]
        ) => ({

          year,

          sessions:
            stats.sessions,

          energy:
            stats.energy,

          cost:
            stats.cost,

        })
      )
      .sort(
        (a, b) =>
          Number(b.year) -
          Number(a.year)
      );


  /*
   * ============================================================
   * CHARGING TYPE DATA
   * ============================================================
   */

  const chargingTypeData =
    Object.entries(
      chargerStats
    ).map(
      (
        [
          name,
          value,
        ]
      ) => ({

        name,

        value,

      })
    );


  /*
   * ============================================================
   * RECENT SESSIONS
   *
   * Keep the Analytics list explicitly sorted newest -> oldest,
   * matching the Tracker page behavior.
   * ============================================================
   */

  const recentSessions =
    [...sessions].sort(
      (a, b) => {

        const dateA =
          new Date(
            a.date
          ).getTime();

        const dateB =
          new Date(
            b.date
          ).getTime();

        if (
          !Number.isNaN(
            dateA
          ) &&
          !Number.isNaN(
            dateB
          )
        ) {

          return dateB - dateA;

        }

        return b.date.localeCompare(
          a.date
        );

      }
    );


  /*
   * ============================================================
   * COLORS
   * ============================================================
   */

  const COLORS = [

    "#22c55e",

    "#3b82f6",

    "#f59e0b",

    "#ef4444",

    "#8b5cf6",

    "#06b6d4",

    "#a855f7",

    "#84cc16",

  ];


  /*
   * ============================================================
   * COMMON DISPLAY COLORS
   * ============================================================
   */

  const VALUE_ORANGE =
    "#f97316";

  const PRIMARY_TEXT =
    "#f8fafc";

  const SECONDARY_TEXT =
    "#cbd5e1";

  const MUTED_TEXT =
    "#94a3b8";

  /*
   * ============================================================
   * KPI CARD DISPLAY
   * ============================================================
   */

  const KPI_CARDS = [
    {
      accent: "#3b82f6",
      glow: "rgba(59,130,246,0.22)",
      icon: "▦",
      valueSize: "36px",
    },
    {
      accent: "#22c55e",
      glow: "rgba(34,197,94,0.22)",
      icon: "ϟ",
      valueSize: "34px",
    },
    {
      accent: "#f59e0b",
      glow: "rgba(245,158,11,0.22)",
      icon: "₹",
      valueSize: "31px",
    },
    {
      accent: "#a855f7",
      glow: "rgba(168,85,247,0.22)",
      icon: "▥",
      valueSize: "31px",
    },
    {
      accent: "#06b6d4",
      glow: "rgba(6,182,212,0.22)",
      icon: "◇",
      valueSize: "32px",
    },
  ];


  /*
   * ============================================================
   * REPORT DATA
   * ============================================================
   */

  const reportData = {

    totalSessions,

    totalEnergy,

    totalCost,

    averageEnergy,

    averageCost,

    vehicleStats,

    stationStats,

    monthlyStats,

    yearlyStats,

    weeklyStats,

    sessions,

  };


  /*
   * ============================================================
   * CLOSE EXPANDED CHART
   * ============================================================
   */

  function closeExpandedChart() {

    setExpandedChart(null);

  }


  /*
   * ============================================================
   * CHART EXPAND BUTTON
   * ============================================================
   */

  function ExpandButton({
    chart,
  }: {
    chart: Exclude<
      ExpandedChart,
      null
    >;
  }) {

    return (

      <button
        type="button"
        onClick={() =>
          setExpandedChart(chart)
        }
        aria-label="Expand chart"
        title="View chart full screen"
        style={{
          position:
            "absolute",
          top:
            "14px",
          right:
            "14px",
          width:
            "34px",
          height:
            "34px",
          border:
            "1px solid rgba(255,255,255,0.14)",
          borderRadius:
            "8px",
          background:
            "rgba(255,255,255,0.06)",
          color:
            PRIMARY_TEXT,
          cursor:
            "pointer",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontSize:
            "18px",
          zIndex:
            5,
        }}
      >
        ⛶
      </button>

    );

  }


  /*
   * ============================================================
   * MONTHLY SPEND CHART
   * ============================================================
   */

  function MonthlySpendChart({
    expanded = false,
  }: {
    expanded?: boolean;
  }) {

    return (

      <ResponsiveContainer
        width="100%"
        height={
          expanded
            ? 560
            : 320
        }
      >

        <AreaChart
          data={
            monthlyChartData
          }
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(203,213,225,0.18)"
          />


          <XAxis
            dataKey="month"
            tick={{
              fill:
                PRIMARY_TEXT,
              fontSize:
                12,
            }}
            tickLine={{
              stroke:
                MUTED_TEXT,
            }}
            axisLine={{
              stroke:
                MUTED_TEXT,
            }}
          />


          <YAxis
            tick={{
              fill:
                PRIMARY_TEXT,
              fontSize:
                12,
            }}
            tickLine={{
              stroke:
                MUTED_TEXT,
            }}
            axisLine={{
              stroke:
                MUTED_TEXT,
            }}
          />


          <Tooltip
            contentStyle={{
              background:
                "#1e293b",
              border:
                "1px solid #475569",
              borderRadius:
                "8px",
              color:
                PRIMARY_TEXT,
            }}
            labelStyle={{
              color:
                PRIMARY_TEXT,
            }}
            itemStyle={{
              color:
                VALUE_ORANGE,
            }}
            formatter={(
              value
            ) =>
              `₹${Number(
                value
              ).toLocaleString()}`
            }
          />


          <Legend
            wrapperStyle={{
              color:
                PRIMARY_TEXT,
            }}
          />


          <Area
            type="monotone"
            dataKey="cost"
            name="Spend"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.2}
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    );

  }


  /*
   * ============================================================
   * MONTHLY ENERGY CHART
   * ============================================================
   */

  function MonthlyEnergyChart({
    expanded = false,
  }: {
    expanded?: boolean;
  }) {

    return (

      <ResponsiveContainer
        width="100%"
        height={
          expanded
            ? 560
            : 320
        }
      >

        <LineChart
          data={
            monthlyChartData
          }
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(203,213,225,0.18)"
          />


          <XAxis
            dataKey="month"
            tick={{
              fill:
                PRIMARY_TEXT,
              fontSize:
                12,
            }}
            tickLine={{
              stroke:
                MUTED_TEXT,
            }}
            axisLine={{
              stroke:
                MUTED_TEXT,
            }}
          />


          <YAxis
            tick={{
              fill:
                PRIMARY_TEXT,
              fontSize:
                12,
            }}
            tickLine={{
              stroke:
                MUTED_TEXT,
            }}
            axisLine={{
              stroke:
                MUTED_TEXT,
            }}
          />


          <Tooltip
            contentStyle={{
              background:
                "#1e293b",
              border:
                "1px solid #475569",
              borderRadius:
                "8px",
              color:
                PRIMARY_TEXT,
            }}
            labelStyle={{
              color:
                PRIMARY_TEXT,
            }}
            itemStyle={{
              color:
                VALUE_ORANGE,
            }}
            formatter={(
              value
            ) =>
              `${Number(
                value
              ).toFixed(1)} kWh`
            }
          />


          <Legend
            wrapperStyle={{
              color:
                PRIMARY_TEXT,
            }}
          />


          <Line
            type="monotone"
            dataKey="energy"
            name="Energy (kWh)"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 4,
              fill:
                "#3b82f6",
            }}
            activeDot={{
              r: 7,
              fill:
                "#f97316",
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    );

  }


  /*
   * ============================================================
   * WEEKLY ACTIVITY CHART
   * ============================================================
   */

  function WeeklyActivityChart({
    expanded = false,
  }: {
    expanded?: boolean;
  }) {

    const [animateExpanded, setAnimateExpanded] =
      useState(false);

    useEffect(() => {

      if (!expanded) {

        setAnimateExpanded(false);

        return;

      }

      setAnimateExpanded(false);

      const frame =
        requestAnimationFrame(() => {
          setAnimateExpanded(true);
        });

      return () =>
        cancelAnimationFrame(frame);

    }, [expanded]);


    const orderedDays = [

      "Monday",

      "Tuesday",

      "Wednesday",

      "Thursday",

      "Friday",

      "Saturday",

      "Sunday",

    ];


    const maxSessions =
      Math.max(
        ...Object.values(
          weeklyStats
        ),
        1
      );


    return (

      <div
        style={{
          width:
            "100%",
          minHeight:
            expanded
              ? "520px"
              : "230px",
          display:
            "flex",
          flexDirection:
            "column",
          justifyContent:
            "center",
        }}
      >

        {Object.values(
          weeklyStats
        ).every(
          (value) =>
            value === 0
        ) ? (

          <div
            style={{
              minHeight:
                "220px",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              color:
                SECONDARY_TEXT,
              fontSize:
                "14px",
            }}
          >
            No weekly charging
            activity available.
          </div>

        ) : (

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(7, minmax(0, 1fr))",
              gap:
                expanded
                  ? "24px"
                  : "10px",
              alignItems:
                "end",
              minHeight:
                expanded
                  ? "440px"
                  : "230px",
              padding:
                expanded
                  ? "20px"
                  : "0",
            }}
          >

            {orderedDays.map(
              (day) => {

                const daySessions =
                  weeklyStats[
                    day
                  ] || 0;


                const intensity =
                  daySessions /
                  maxSessions;


                const barHeight =
                  daySessions ===
                  0
                    ? 12
                    : 35 +
                      intensity *
                        (
                          expanded
                            ? 300
                            : 130
                        );


                return (

                  <div
                    key={day}
                    title={`${day}: ${daySessions} charging ${
                      daySessions === 1
                        ? "session"
                        : "sessions"
                    }`}
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      justifyContent:
                        "flex-end",
                      height:
                        expanded
                          ? "400px"
                          : "210px",
                    }}
                  >

                    {/* Session count */}

                    <div
                      style={{
                        fontSize:
                          expanded
                            ? "20px"
                            : "15px",
                        fontWeight:
                          400,
                        color:
                          VALUE_ORANGE,
                        marginBottom:
                          "8px",
                        opacity:
                          expanded && !animateExpanded
                            ? 0
                            : 1,
                        transform:
                          expanded && !animateExpanded
                            ? "translateY(8px)"
                            : "translateY(0)",
                        transition:
                          expanded
                            ? "opacity 0.45s ease 0.15s, transform 0.45s ease 0.15s"
                            : "none",
                      }}
                    >
                      {
                        daySessions
                      }
                    </div>


                    {/* Activity bar */}

                    <div
                      style={{
                        width:
                          "100%",
                        maxWidth:
                          expanded
                            ? "90px"
                            : "58px",
                        height:
                          `${
                            expanded && !animateExpanded
                              ? 12
                              : barHeight
                          }px`,
                        minHeight:
                          "12px",
                        borderRadius:
                          "16px 16px 8px 8px",
                        background:
                          daySessions ===
                          0
                            ? "#64748b"
                            : "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
                        boxShadow:
                          daySessions >
                          0
                            ? "0 6px 18px rgba(34,197,94,0.20)"
                            : "none",
                        transition:
                          expanded
                            ? "height 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
                            : "height 0.3s ease",
                      }}
                    />


                    {/* Day */}

                    <div
                      style={{
                        marginTop:
                          "10px",
                        fontSize:
                          expanded
                            ? "15px"
                            : "13px",
                        fontWeight:
                          400,
                        color:
                          PRIMARY_TEXT,
                        textAlign:
                          "center",
                      }}
                    >
                      {day.slice(
                        0,
                        3
                      )}
                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}


        {/* Legend */}

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            gap:
              "8px",
            marginTop:
              "16px",
            fontSize:
              "12px",
            color:
              SECONDARY_TEXT,
            fontWeight:
              400,
          }}
        >

          <span
            style={{
              width:
                "9px",
              height:
                "9px",
              borderRadius:
                "50%",
              background:
                "#64748b",
              display:
                "inline-block",
            }}
          />

          No charging


          <span
            style={{
              width:
                "9px",
              height:
                "9px",
              borderRadius:
                "50%",
              background:
                "#22c55e",
              display:
                "inline-block",
              marginLeft:
                "8px",
            }}
          />

          Charging activity

        </div>

      </div>

    );

  }


  /*
   * ============================================================
   * CHARGING TYPE DONUT
   * ============================================================
   */

  function ChargingTypeChart({
    expanded = false,
  }: {
    expanded?: boolean;
  }) {

    if (
      chargingTypeData.length ===
      0
    ) {

      return (

        <div
          style={{
            minHeight:
              expanded
                ? "600px"
                : "350px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            color:
              SECONDARY_TEXT,
            fontSize:
              "14px",
          }}
        >
          No charging type
          data available.
        </div>

      );

    }


    return (

      <div
        className={
          expanded
            ? "analyticsChargingTypeChart analyticsChargingTypeChartExpanded"
            : "analyticsChargingTypeChart"
        }
        style={{
          position:
            "relative",
          width:
            "100%",
          height:
            expanded
              ? "min(70vh, 560px)"
              : "350px",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={
                chargingTypeData
              }
              dataKey="value"
              nameKey="name"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={expanded ? 900 : 700}
              animationEasing="ease-out"
              cx="50%"
              cy={
                expanded
                  ? "40%"
                  : "45%"
              }
              innerRadius={
                expanded
                  ? "20%"
                  : 78
              }
              outerRadius={
                expanded
                  ? "34%"
                  : 125
              }
              paddingAngle={3}
              cornerRadius={6}
              labelLine={{
                stroke:
                  SECONDARY_TEXT,
              }}
              label={{
                fill:
                  VALUE_ORANGE,
                fontSize:
                  expanded
                    ? 16
                    : 14,
              }}
            >

              {chargingTypeData.map(
                (
                  _,
                  index
                ) => (

                  <Cell
                    key={
                      index
                    }
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>


            <Tooltip
              contentStyle={{
                background:
                  "#1e293b",
                border:
                  "1px solid #475569",
                borderRadius:
                  "8px",
                color:
                  PRIMARY_TEXT,
              }}
              labelStyle={{
                color:
                  PRIMARY_TEXT,
              }}
              itemStyle={{
                color:
                  VALUE_ORANGE,
              }}
            />


            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color:
                  PRIMARY_TEXT,
              }}
            />

          </PieChart>

        </ResponsiveContainer>


        {/* Charging type summary stays above the chart */}
        <div
          className="analyticsChargingTypeSummary"
          style={{
            position:
              "absolute",
            top:
              expanded
                ? "18px"
                : "0px",
            left:
              "50%",
            transform:
              "translateX(-50%)",
            textAlign:
              "center",
            pointerEvents:
              "none",
            zIndex:
              3,
            whiteSpace:
              "nowrap",
            animation:
              expanded
                ? "chargingTypeSummaryIn 0.55s ease-out"
                : "none",
          }}
        >
          <div
            style={{
              fontSize:
                expanded
                  ? "15px"
                  : "12px",
              fontWeight:
                700,
              color:
                VALUE_ORANGE,
              letterSpacing:
                "0.4px",
              lineHeight:
                1.2,
            }}
          >
            TOTAL SESSIONS
          </div>

          <div
            style={{
              marginTop:
                "3px",
              fontSize:
                expanded
                  ? "34px"
                  : "22px",
              fontWeight:
                700,
              color:
                VALUE_ORANGE,
              lineHeight:
                1,
            }}
          >
            {totalSessions}
          </div>
        </div>

      </div>

    );

  }


  /*
   * ============================================================
   * EXPANDED CHART OVERLAY
   * ============================================================
   */

  function ExpandedChartModal() {

    if (
      !expandedChart
    ) {

      return null;

    }


    let title =
      "";


    let content:
      React.ReactNode =
      null;


    if (
      expandedChart ===
      "monthlySpend"
    ) {

      title =
        "💰 Monthly Spend Trend";

      content =
        <MonthlySpendChart
          expanded
        />;

    }


    if (
      expandedChart ===
      "monthlyEnergy"
    ) {

      title =
        "⚡ Monthly Energy Trend";

      content =
        <MonthlyEnergyChart
          expanded
        />;

    }


    if (
      expandedChart ===
      "weeklyActivity"
    ) {

      title =
        "⚡ Weekly Charging Activity";

      content =
        <WeeklyActivityChart
          expanded
        />;

    }


    if (
      expandedChart ===
      "chargingType"
    ) {

      title =
        "🔌 Charging Type Distribution";

      content =
        <ChargingTypeChart
          expanded
        />;

    }


    return (

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position:
            "fixed",
          inset:
            0,
          zIndex:
            9999,
          background:
            "rgba(2,6,23,0.88)",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          padding:
            "24px",
        }}
        onMouseDown={(event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            closeExpandedChart();

          }

        }}
      >

        <div
          className="analyticsExpandedChartModal"
          style={{
            width:
              "calc(100vw - 24px)",
            maxWidth:
              "1200px",
            maxHeight:
              "calc(100vh - 24px)",
            overflow:
              "auto",
            boxSizing:
              "border-box",
            background:
              "#1e293b",
            border:
              "1px solid rgba(255,255,255,0.12)",
            borderRadius:
              "18px",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.45)",
            padding:
              "16px",
          }}
        >

          {/* Modal header */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "16px",
              marginBottom:
                "12px",
            }}
          >

            <h2
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
                fontSize:
                  "18px",
                fontWeight:
                  400,
              }}
            >
              {title}
            </h2>


            <button
              type="button"
              onClick={
                closeExpandedChart
              }
              aria-label="Close chart"
              title="Close"
              style={{
                width:
                  "38px",
                height:
                  "38px",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                borderRadius:
                  "9px",
                background:
                  "rgba(255,255,255,0.06)",
                color:
                  PRIMARY_TEXT,
                cursor:
                  "pointer",
                fontSize:
                  "19px",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              ✕
            </button>

          </div>


          {content}

        </div>

      </div>

    );

  }


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {

    return (

      <div className="welcome">

        <h2>
          Loading analytics...
        </h2>

      </div>

    );

  }


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <>

      <style>{`
        .analyticsChargingTypeChart {
          box-sizing: border-box;
        }

        .analyticsChargingTypeSummary {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .analyticsChargingTypeChart {
            height: 300px !important;
            overflow: visible;
          }

          .analyticsChargingTypeChart > .recharts-responsive-container {
            height: 100% !important;
          }

          .analyticsChargingTypeSummary {
            top: 2px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100%;
            white-space: nowrap;
          }

          .analyticsChargingTypeChart:not(.analyticsChargingTypeChartExpanded) .analyticsChargingTypeSummary > div:first-child {
            font-size: 12px !important;
          }

          .analyticsChargingTypeChart:not(.analyticsChargingTypeChartExpanded) .analyticsChargingTypeSummary > div:last-child {
            font-size: 24px !important;
            margin-top: 4px !important;
          }

          .analyticsChargingTypeChart:not(.analyticsChargingTypeChartExpanded) .recharts-legend-wrapper {
            bottom: 0 !important;
          }

          .analyticsChargingTypeChart:not(.analyticsChargingTypeChartExpanded) .recharts-wrapper {
            max-width: 100% !important;
          }

          .analyticsChargingTypeChart:not(.analyticsChargingTypeChartExpanded) .recharts-surface {
            overflow: visible;
          }

          .analyticsExpandedChartModal {
            width: calc(100vw - 20px) !important;
            max-width: calc(100vw - 20px) !important;
            max-height: calc(100vh - 20px) !important;
            padding: 12px !important;
            border-radius: 16px !important;
            overflow-x: hidden !important;
          }

          .analyticsExpandedChartModal .analyticsChargingTypeChartExpanded {
            height: 420px !important;
          }

          .analyticsChargingTypeChartExpanded .analyticsChargingTypeSummary {
            top: 0 !important;
          }

          .analyticsChargingTypeChartExpanded .analyticsChargingTypeSummary > div:first-child {
            font-size: 15px !important;
          }

          .analyticsChargingTypeChartExpanded .analyticsChargingTypeSummary > div:last-child {
            font-size: 36px !important;
          }
        }
      `}</style>

      <div id="analyticsDashboard">

      {/* ==================================================
          DASHBOARD HEADER
          ================================================== */}

      <div className="welcome">

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "12px",
            width: "100%",
          }}
        >
          <UserDetails
            onClick={() => {
              onNavigate?.("profile");
            }}
          />
        </div>


        <h2
          style={{
            margin: 0,
          }}
        >
          📊 Analytics Dashboard
        </h2>


        <p>
          Family-wide insights into
          your EV charging history.
        </p>


        <div
          style={{
            marginTop:
              "16px",
          }}
        >

          {subscriptionLoading ? (
            <div
              style={{
                padding:
                  "12px",
              }}
            >
              Loading report tools...
            </div>
          ) : subscriptionPlan === "free" ? (
            <div
              style={{
                padding:
                  "12px 14px",
                border:
                  "1px solid rgba(220,38,38,0.30)",
                borderRadius:
                  "10px",
                background:
                  "rgba(220,38,38,0.08)",
                color:
                  "#cbd5e1",
                fontSize:
                  "13px",
              }}
            >
              📄 Analytics PDF Export is available with Premium and Premium Plus.
              Premium is ₹69 one-time.
            </div>
          ) : (
            <Suspense
              fallback={
                <div
                  style={{
                    padding:
                      "12px",
                  }}
                >
                  Loading report tools...
                </div>
              }
            >
              <ReportToolbar
                reportData={
                  reportData
                }
              />
            </Suspense>
          )}

        </div>

      </div>


      {/* ==================================================
          KPI CARDS
          ================================================== */}

      <div
        className="statsGrid"
        style={{
          gap: "14px",
        }}
      >

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
              `0 8px 24px ${KPI_CARDS[0].glow}`,
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
                  `linear-gradient(145deg, ${KPI_CARDS[0].accent}, #2563eb)`,
                color:
                  "#ffffff",
                fontSize:
                  "20px",
                fontWeight:
                  800,
                boxShadow:
                  `0 0 18px ${KPI_CARDS[0].glow}`,
                flexShrink:
                  0,
              }}
            >
              {KPI_CARDS[0].icon}
            </div>

            <h3
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
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
                `0 0 18px ${KPI_CARDS[0].glow}`,
            }}
          >
            {totalSessions}
          </h1>

        </div>


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
              `0 8px 24px ${KPI_CARDS[1].glow}`,
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
                  `0 0 18px ${KPI_CARDS[1].glow}`,
                flexShrink:
                  0,
              }}
            >
              {KPI_CARDS[1].icon}
            </div>

            <h3
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
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
                `0 0 18px ${KPI_CARDS[1].glow}`,
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
              `0 8px 24px ${KPI_CARDS[2].glow}`,
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
                  `0 0 18px ${KPI_CARDS[2].glow}`,
                flexShrink:
                  0,
              }}
            >
              {KPI_CARDS[2].icon}
            </div>

            <h3
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
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
              Total Spend
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
                `0 0 18px ${KPI_CARDS[2].glow}`,
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


        <div
          className="statCard"
          style={{
            background:
              "linear-gradient(145deg, rgba(88,28,135,0.34), rgba(15,23,42,0.96))",
            border:
              "1px solid rgba(168,85,247,0.48)",
            borderRadius:
              "16px",
            boxShadow:
              `0 8px 24px ${KPI_CARDS[3].glow}`,
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
                  "linear-gradient(145deg, #a855f7, #7e22ce)",
                color:
                  "#ffffff",
                fontSize:
                  "20px",
                fontWeight:
                  800,
                boxShadow:
                  `0 0 18px ${KPI_CARDS[3].glow}`,
                flexShrink:
                  0,
              }}
            >
              {KPI_CARDS[3].icon}
            </div>

            <h3
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
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
              Avg. Cost / Session
            </h3>

          </div>

          <h1
            style={{
              margin:
                0,
              color:
                "#d8b4fe",
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
                `0 0 18px ${KPI_CARDS[3].glow}`,
              whiteSpace:
                "nowrap",
            }}
          >
            ₹{averageCost.toFixed(2)}
          </h1>

        </div>


        <div
          className="statCard"
          style={{
            background:
              "linear-gradient(145deg, rgba(8,80,92,0.34), rgba(15,23,42,0.96))",
            border:
              "1px solid rgba(6,182,212,0.48)",
            borderRadius:
              "16px",
            boxShadow:
              `0 8px 24px ${KPI_CARDS[4].glow}`,
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
                  "linear-gradient(145deg, #06b6d4, #0891b2)",
                color:
                  "#ffffff",
                fontSize:
                  "21px",
                fontWeight:
                  800,
                boxShadow:
                  `0 0 18px ${KPI_CARDS[4].glow}`,
                flexShrink:
                  0,
              }}
            >
              {KPI_CARDS[4].icon}
            </div>

            <h3
              style={{
                margin:
                  0,
                color:
                  PRIMARY_TEXT,
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
              Avg. Energy / Session
            </h3>

          </div>

          <h1
            style={{
              margin:
                0,
              color:
                "#22d3ee",
              fontFamily:
                '"Inter", "Segoe UI", Arial, sans-serif',
              fontSize:
                "25px",
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
                `0 0 18px ${KPI_CARDS[4].glow}`,
              whiteSpace:
                "nowrap",
            }}
          >
            {averageEnergy.toFixed(1)}{" "}
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

      </div>


      {/* ==================================================
          MONTHLY SPEND
          ================================================== */}

      <div
        id="monthlySpendChart"
        className="card"
        style={{
          position:
            "relative",
        }}
      >

        <ExpandButton
          chart="monthlySpend"
        />


        <h3>
          💰 Monthly Spend Trend
        </h3>


        <p
          style={{
            marginTop:
              "-6px",
            marginBottom:
              "10px",
            fontSize:
              "13px",
            color:
              SECONDARY_TEXT,
          }}
        >
          Latest month first
        </p>


        <MonthlySpendChart />

      </div>


      {/* ==================================================
          MONTHLY ENERGY
          ================================================== */}

      <div
        id="monthlyEnergyChart"
        className="card"
        style={{
          position:
            "relative",
        }}
      >

        <ExpandButton
          chart="monthlyEnergy"
        />


        <h3>
          ⚡ Monthly Energy Trend
        </h3>


        <p
          style={{
            marginTop:
              "-6px",
            marginBottom:
              "10px",
            fontSize:
              "13px",
            color:
              SECONDARY_TEXT,
          }}
        >
          Latest month first
        </p>


        <MonthlyEnergyChart />

      </div>


      {/* ==================================================
          WEEKLY CHARGING ACTIVITY
          ================================================== */}

      <div
        id="weeklySessionsChart"
        className="card"
        style={{
          position:
            "relative",
        }}
      >

        <ExpandButton
          chart="weeklyActivity"
        />


        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "12px",
            marginBottom:
              "18px",
            paddingRight:
              "48px",
            flexWrap:
              "wrap",
          }}
        >

          <div>

            <h3
              style={{
                marginBottom:
                  "4px",
              }}
            >
              ⚡ Weekly Charging Activity
            </h3>


            <p
              style={{
                margin:
                  0,
                fontSize:
                  "13px",
                color:
                  SECONDARY_TEXT,
              }}
            >
              Your charging rhythm
              across the week
            </p>

          </div>


          <div
            style={{
              fontSize:
                "15px",
              fontWeight:
                400,
              color:
                VALUE_ORANGE,
            }}
          >

            {Object.values(
              weeklyStats
            ).reduce(
              (
                sum,
                value
              ) =>
                sum + value,
              0
            )}{" "}

            sessions

          </div>

        </div>


        <WeeklyActivityChart />

      </div>


      {/* ==================================================
          WEEKLY SUMMARY
          ================================================== */}

      <div className="card">

        <h3>
          Weekly Summary
        </h3>


        <div className="tableContainer">

          <table className="table">

            <thead>

              <tr>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "left",
                  }}
                >
                  Day
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Sessions
                </th>

              </tr>

            </thead>


            <tbody>

              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map(
                (day) => (

                  <tr
                    key={day}
                  >

                    <td
                      style={{
                        color:
                          PRIMARY_TEXT,
                        fontWeight:
                          400,
                    textAlign:
                      "left",
                      }}
                    >
                      {day}
                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >
                      {
                        weeklyStats[
                          day
                        ]
                      }
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          MONTHLY SUMMARY
          ================================================== */}

      <div className="card">

        <h3>
          Monthly Summary
        </h3>


        <div className="tableContainer">

          <table className="table">

            <thead>

              <tr>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "left",
                  }}
                >
                  Month
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Sessions
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Energy
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Spend
                </th>

              </tr>

            </thead>


            <tbody>

              {monthlySummaryData.map(
                (stats) => (

                  <tr
                    key={
                      stats.month
                    }
                  >

                    <td
                      style={{
                        color:
                          PRIMARY_TEXT,
                        fontWeight:
                          400,
                    textAlign:
                      "left",
                      }}
                    >
                      {
                        stats.month
                      }
                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >
                      {
                        stats.sessions
                      }
                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >

                      {stats.energy.toFixed(
                        1
                      )}{" "}

                      kWh

                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >

                      ₹
                      {stats.cost.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        }
                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          VEHICLE STATISTICS
          ================================================== */}

      <div className="card">

        <h3>
          🚗 Vehicle Statistics
        </h3>


        {Object.keys(
          vehicleStats
        ).length === 0 ? (

          <p
            style={{
              color:
                SECONDARY_TEXT,
            }}
          >
            No charging data
            available.
          </p>

        ) : (

          <div className="tableContainer">

            <table className="table">

              <thead>

                <tr>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Vehicle
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Sessions
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Energy
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Spend
                  </th>

                </tr>

              </thead>


              <tbody>

                {Object.entries(
                  vehicleStats
                ).map(
                  (
                    [
                      vehicle,
                      stats,
                    ]
                  ) => (

                    <tr
                      key={
                        vehicle
                      }
                    >

                      <td
                        style={{
                          color:
                            PRIMARY_TEXT,
                          fontWeight:
                            400,
                    textAlign:
                      "left",
                        }}
                      >
                        {vehicle}
                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >
                        {
                          stats.sessions
                        }
                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >

                        {stats.energy.toFixed(
                          1
                        )}{" "}

                        kWh

                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >

                        ₹
                        {stats.cost.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits:
                              2,
                            maximumFractionDigits:
                              2,
                          }
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          STATION STATISTICS
          ================================================== */}

      <div className="card">

        <h3>
          🏢 Charging Station
          Statistics
        </h3>


        {Object.keys(
          stationStats
        ).length === 0 ? (

          <p
            style={{
              color:
                SECONDARY_TEXT,
            }}
          >
            No charging station
            data available.
          </p>

        ) : (

          <div className="tableContainer">

            <table className="table">

              <thead>

                <tr>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Station
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Sessions
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Energy
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Spend
                  </th>

                </tr>

              </thead>


              <tbody>

                {Object.entries(
                  stationStats
                ).map(
                  (
                    [
                      station,
                      stats,
                    ]
                  ) => (

                    <tr
                      key={
                        station
                      }
                    >

                      <td
                        style={{
                          color:
                            PRIMARY_TEXT,
                          fontWeight:
                            400,
                    textAlign:
                      "left",
                        }}
                      >
                        {station}
                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >
                        {
                          stats.sessions
                        }
                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >

                        {stats.energy.toFixed(
                          1
                        )}{" "}

                        kWh

                      </td>

                      <td
                        style={{
                          color:
                            VALUE_ORANGE,
                          fontWeight:
                            400,
                    textAlign:
                      "right",
                        }}
                      >

                        ₹
                        {stats.cost.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits:
                              2,
                            maximumFractionDigits:
                              2,
                          }
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          CHARGING TYPE DISTRIBUTION
          ================================================== */}

      <div
        id="chargingTypeChart"
        className="card"
        style={{
          position:
            "relative",
        }}
      >

        <ExpandButton
          chart="chargingType"
        />


        <div
          style={{
            paddingRight:
              "48px",
          }}
        >

          <h3
            style={{
              marginBottom:
                "4px",
            }}
          >
            🔌 Charging Type
            Distribution
          </h3>


          <p
            style={{
              margin:
                0,
              fontSize:
                "13px",
              color:
                SECONDARY_TEXT,
            }}
          >
            Sessions by charger type
          </p>

        </div>


        <ChargingTypeChart />

      </div>


      {/* ==================================================
          YEARLY SUMMARY
          ================================================== */}

      <div className="card">

        <h3>
          📅 Yearly Summary
        </h3>


        <div className="tableContainer">

          <table className="table">

            <thead>

              <tr>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "left",
                  }}
                >
                  Year
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Sessions
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Energy
                </th>

                <th
                  style={{
                    color:
                      PRIMARY_TEXT,
                    textAlign:
                      "right",
                  }}
                >
                  Spend
                </th>

              </tr>

            </thead>


            <tbody>

              {yearlySummaryData.map(
                (stats) => (

                  <tr
                    key={
                      stats.year
                    }
                  >

                    <td
                      style={{
                        color:
                          PRIMARY_TEXT,
                        fontWeight:
                          400,
                    textAlign:
                      "left",
                      }}
                    >
                      {stats.year}
                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >
                      {
                        stats.sessions
                      }
                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >

                      {stats.energy.toFixed(
                        1
                      )}{" "}

                      kWh

                    </td>

                    <td
                      style={{
                        color:
                          VALUE_ORANGE,
                        fontWeight:
                          400,
                    textAlign:
                      "right",
                      }}
                    >

                      ₹
                      {stats.cost.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits:
                            2,
                          maximumFractionDigits:
                            2,
                        }
                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          RECENT SESSIONS
          ================================================== */}

      <div className="card">

        <h3>
          📝 Recent Charging
          Sessions
        </h3>


        {sessions.length ===
        0 ? (

          <p
            style={{
              color:
                SECONDARY_TEXT,
            }}
          >
            No charging sessions
            found.
          </p>

        ) : (

          <div className="tableContainer">

            <table className="table">

              <thead>

                <tr>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    No.
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Vehicle
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Station
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "left",
                    }}
                  >
                    Type
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Energy
                  </th>

                  <th
                    style={{
                      color:
                        PRIMARY_TEXT,
                    textAlign:
                      "right",
                    }}
                  >
                    Cost
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentSessions
                  .map(
                    (
                      session,
                      index
                    ) => (

                      <tr
                        key={
                          session.id
                        }
                      >

                        <td
                          style={{
                            color:
                              VALUE_ORANGE,
                            fontWeight:
                              400,
                    textAlign:
                      "left",
                          }}
                        >
                          {index + 1}
                        </td>


                        <td
                          style={{
                            color:
                              PRIMARY_TEXT,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >
                          {
                            session.date
                          }
                        </td>


                        <td
                          style={{
                            color:
                              PRIMARY_TEXT,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >
                          {
                            session.vehicle
                          }
                        </td>


                        <td
                          style={{
                            color:
                              PRIMARY_TEXT,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >
                          {
                            session.station ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            color:
                              PRIMARY_TEXT,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >
                          {
                            session.charger
                          }
                        </td>


                        <td
                          style={{
                            color:
                              VALUE_ORANGE,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >

                          {session.energy.toFixed(
                            1
                          )}{" "}

                          kWh

                        </td>


                        <td
                          style={{
                            color:
                              VALUE_ORANGE,
                            fontWeight:
                              400,
                    textAlign:
                      "right",
                          }}
                        >

                          ₹
                          {session.cost.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits:
                                2,
                              maximumFractionDigits:
                                2,
                            }
                          )}

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          EXPANDED CHART MODAL
          ================================================== */}

      <ExpandedChartModal />

      </div>

    </>

  );

}


export default Analytics;