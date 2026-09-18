import { FileText } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../lib/supabase";

interface ReportToolbarProps {
  reportData: any;
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 10;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  background: "#0f172a",
  card: "#1e293b",
  cardBorder: "#334155",
  text: "#f8fafc",
  secondary: "#cbd5e1",
  muted: "#94a3b8",
  orange: "#ff7a21",
  green: "#22c55e",
};

function formatNumber(value: number, digits = 2): string {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatCurrency(value: number): string {
  return formatNumber(value, 2);
}

function formatEnergy(value: number): string {
  return `${formatNumber(value, 2)} kWh`;
}

function asEntries(value: any): Array<[string, any]> {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item, index) => [
      String(item?.month ?? item?.year ?? item?.day ?? item?.name ?? index),
      item,
    ]);
  }

  return Object.entries(value);
}

function summaryRows(value: any): Array<{
  name: string;
  sessions: number;
  energy: number;
  cost: number;
}> {
  return asEntries(value).map(([name, stats]) => ({
    name,
    sessions: Number(stats?.sessions || 0),
    energy: Number(stats?.energy || 0),
    cost: Number(stats?.cost || 0),
  }));
}

function monthRows(value: any) {
  return summaryRows(value).sort((a, b) => {
    const dateA = new Date(`1 ${a.name}`);
    const dateB = new Date(`1 ${b.name}`);

    const timeA = dateA.getTime();
    const timeB = dateB.getTime();

    if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
      return timeB - timeA;
    }

    return String(b.name).localeCompare(String(a.name));
  });
}

function yearRows(value: any) {
  return summaryRows(value).sort((a, b) =>
    String(b.name).localeCompare(String(a.name))
  );
}

function weeklyRows(value: any) {
  const order = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const entries = asEntries(value).map(([name, count]) => ({
    name,
    sessions: Number(
      typeof count === "object"
        ? count?.sessions || 0
        : count || 0
    ),
  }));

  return entries.sort(
    (a, b) =>
      order.indexOf(a.name) - order.indexOf(b.name)
  );
}

function sessionRows(value: any) {
  return [...(Array.isArray(value) ? value : [])].sort(
    (a, b) =>
      new Date(b?.date || 0).getTime() -
      new Date(a?.date || 0).getTime()
  );
}

function getPrimaryVehicle(reportData: any): string {
  const rows = summaryRows(reportData?.vehicleStats);

  if (rows.length === 0) return "All vehicles";
  if (rows.length === 1) return rows[0].name;

  return rows.map((row) => row.name).join(", ");
}

function getReportPeriod(reportData: any): string | null {
  const sessions = Array.isArray(reportData?.sessions)
    ? reportData.sessions
    : [];

  const timestamps = sessions
    .map((session: any) =>
      new Date(session?.date || 0).getTime()
    )
    .filter((time: number) => !Number.isNaN(time) && time > 0);

  if (timestamps.length === 0) return null;

  const earliest = new Date(Math.min(...timestamps));
  const latest = new Date(Math.max(...timestamps));

  const formatMonth = (date: Date) =>
    date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });

  return `${formatMonth(earliest)} – ${formatMonth(latest)}`;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function captureElement(element: HTMLElement): Promise<string> {
  const hiddenElements = Array.from(
    element.querySelectorAll<HTMLElement>(
      'button[title="View chart full screen"], .reportToolbar'
    )
  );

  const previousVisibility = hiddenElements.map(
    (item) => item.style.visibility
  );

  try {
    hiddenElements.forEach((item) => {
      item.style.visibility = "hidden";
    });

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    return await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: COLORS.background,
    });
  } finally {
    hiddenElements.forEach((item, index) => {
      item.style.visibility = previousVisibility[index] || "";
    });
  }
}

async function captureBySelector(
  selector: string
): Promise<string | null> {
  const element = document.querySelector<HTMLElement>(selector);

  if (!element) return null;

  return captureElement(element);
}

function addPageBackground(pdf: jsPDF) {
  pdf.setFillColor(COLORS.background);
  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
}

function addPageHeader(
  pdf: jsPDF,
  title: string,
  pageNumber: number
) {
  pdf.setFillColor(COLORS.card);
  pdf.rect(0, 0, PAGE_WIDTH, 22, "F");

  pdf.setTextColor(COLORS.text);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text("EV Toolkit", MARGIN, 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(COLORS.secondary);
  pdf.text(title, PAGE_WIDTH - MARGIN, 14, {
    align: "right",
  });

  pdf.setDrawColor(COLORS.cardBorder);
  pdf.line(
    MARGIN,
    PAGE_HEIGHT - 12,
    PAGE_WIDTH - MARGIN,
    PAGE_HEIGHT - 12
  );

  pdf.setFontSize(8);
  pdf.setTextColor(COLORS.muted);
  pdf.text("Generated by EV Toolkit", MARGIN, PAGE_HEIGHT - 6);
  pdf.text(`Page ${pageNumber}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 6, {
    align: "right",
  });
}

function addSectionTitle(
  pdf: jsPDF,
  title: string,
  y: number
): number {
  pdf.setTextColor(COLORS.text);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text(title, MARGIN, y);

  pdf.setDrawColor(COLORS.green);
  pdf.setLineWidth(0.7);
  pdf.line(MARGIN, y + 4, PAGE_WIDTH - MARGIN, y + 4);

  return y + 12;
}

function addMetricCards(
  pdf: jsPDF,
  reportData: any,
  y: number
): number {
  const metrics = [
    ["Total Sessions", String(reportData?.totalSessions ?? 0)],
    ["Total Energy", formatEnergy(reportData?.totalEnergy)],
    ["Total Spend", formatCurrency(reportData?.totalCost)],
    ["Avg. Cost / Session", formatCurrency(reportData?.averageCost)],
    ["Avg. Energy / Session", formatEnergy(reportData?.averageEnergy)],
  ];

  const gap = 3;
  const cardWidth = (CONTENT_WIDTH - gap * 4) / 5;
  const cardHeight = 28;

  metrics.forEach(([label, value], index) => {
    const x = MARGIN + index * (cardWidth + gap);

    pdf.setFillColor(COLORS.card);
    pdf.setDrawColor(COLORS.cardBorder);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, "FD");

    pdf.setTextColor(COLORS.secondary);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.text(label, x + cardWidth / 2, y + 9, {
      align: "center",
    });

    pdf.setTextColor(COLORS.orange);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(value.length > 13 ? 8.5 : 11);
    pdf.text(value, x + cardWidth / 2, y + 20, {
      align: "center",
    });
  });

  return y + cardHeight;
}

function addTable(
  pdf: jsPDF,
  head: string[][],
  body: string[][],
  startY: number,
  options: {
    widths?: number[];
    fontSize?: number;
  } = {}
) {
  autoTable(pdf, {
    startY,
    head,
    body,
    margin: {
      left: MARGIN,
      right: MARGIN,
    },
    tableWidth: CONTENT_WIDTH,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: options.fontSize ?? 8.2,
      cellPadding: 2.3,
      textColor: COLORS.text,
      fillColor: COLORS.card,
      lineColor: COLORS.cardBorder,
      lineWidth: 0.25,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: "#334155",
      textColor: COLORS.text,
      fontStyle: "bold",
      fontSize: options.fontSize ?? 8.2,
    },
    alternateRowStyles: {
      fillColor: "#172236",
    },
    bodyStyles: {
      fillColor: COLORS.card,
    },
    columnStyles: options.widths
      ? Object.fromEntries(
          options.widths.map((width, index) => [
            index,
            { cellWidth: width },
          ])
        )
      : undefined,
  });

  return (pdf as any).lastAutoTable.finalY as number;
}

async function addChartImage(
  pdf: jsPDF,
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  maxHeight: number
): Promise<number> {
  const image = await loadImage(dataUrl);

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  const ratio = Math.min(
    width / imageWidth,
    maxHeight / imageHeight
  );

  const renderedWidth = imageWidth * ratio;
  const renderedHeight = imageHeight * ratio;
  const centeredX = x + (width - renderedWidth) / 2;

  pdf.addImage(
    dataUrl,
    "PNG",
    centeredX,
    y,
    renderedWidth,
    renderedHeight,
    undefined,
    "FAST"
  );

  return y + renderedHeight;
}

function addCoverPage(pdf: jsPDF, reportData: any) {
  addPageBackground(pdf);

  pdf.setFillColor("#0b9f91");
  pdf.rect(0, 0, PAGE_WIDTH, 48, "F");

  pdf.setTextColor("#ffffff");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(25);
  pdf.text("EV Toolkit", PAGE_WIDTH / 2, 21, {
    align: "center",
  });

  pdf.setFontSize(16);
  pdf.text("Charging Analytics Report", PAGE_WIDTH / 2, 33, {
    align: "center",
  });

  let y = 66;
  y = addSectionTitle(pdf, "Report Information", y);

  const generatedOn = new Date().toLocaleString("en-IN");

  const reportPeriod = getReportPeriod(reportData);
  const userDetails = reportData?.userDetails ?? {
    name: "User",
    email: "",
  };

  const rows = [
    ["Generated On", generatedOn],
    ["User", userDetails.name],
    ...(userDetails.email
      ? [["Email", userDetails.email]]
      : []),
    ["Prepared By", "EV Toolkit"],
    ["Vehicle", getPrimaryVehicle(reportData)],
    ...(reportPeriod ? [["Report Period", reportPeriod]] : []),
    ["Total Sessions", String(reportData?.totalSessions ?? 0)],
    ["Total Energy", formatEnergy(reportData?.totalEnergy)],
    ["Total Spend", formatCurrency(reportData?.totalCost)],
  ];

  if (reportData?.petrolSaved !== undefined) {
    rows.push([
      "Petrol Saved",
      `${formatNumber(reportData.petrolSaved, 2)} L`,
    ]);
  }

  if (reportData?.carbonSaved !== undefined) {
    rows.push([
      "Carbon Saved",
      `${formatNumber(reportData.carbonSaved, 2)} kg`,
    ]);
  }

  addTable(
    pdf,
    [["Field", "Value"]],
    rows,
    y,
    {
      widths: [
        CONTENT_WIDTH * 0.42,
        CONTENT_WIDTH * 0.58,
      ],
      fontSize: 9,
    }
  );

  y = (pdf as any).lastAutoTable.finalY + 22;
  y = addSectionTitle(pdf, "Executive Summary", y);

  const sessionList = Array.isArray(reportData?.sessions)
    ? reportData.sessions
    : [];

  const uniqueStations = new Set(
    sessionList
      .map((session: any) => String(session?.station || "").trim())
      .filter(Boolean)
  ).size;

  const chargerTypeCounts = sessionList.reduce(
    (counts: Record<string, number>, session: any) => {
      const type = String(session?.charger || "").trim();

      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }

      return counts;
    },
    {}
  );

  const chargerTypeSummary = Object.entries(chargerTypeCounts)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .map(([type, count]) => `${type}: ${count}`)
    .join(" • ");

  const executiveRows = [
    ["Average Energy / Session", formatEnergy(reportData?.averageEnergy)],
    ["Average Cost / Session", formatCurrency(reportData?.averageCost)],
    ["Charging Stations", String(uniqueStations)],
    ["Charging Type Split", chargerTypeSummary || "—"],
  ];

  if (reportData?.petrolSaved !== undefined) {
    executiveRows.push([
      "Petrol Saved",
      `${formatNumber(reportData.petrolSaved, 2)} L`,
    ]);
  }

  if (reportData?.carbonSaved !== undefined) {
    executiveRows.push([
      "Carbon Saved",
      `${formatNumber(reportData.carbonSaved, 2)} kg`,
    ]);
  }

  addTable(
    pdf,
    [["Metric", "Value"]],
    executiveRows,
    y,
    {
      widths: [
        CONTENT_WIDTH * 0.55,
        CONTENT_WIDTH * 0.45,
      ],
      fontSize: 9,
    }
  );

  pdf.setTextColor(COLORS.muted);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  pdf.text(
    "Confidential • Generated by EV Toolkit",
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 18,
    { align: "center" }
  );
}

async function exportAnalyticsPDF(reportData: any) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // PAGE 1 — COVER + EXECUTIVE SUMMARY
  addCoverPage(pdf, reportData);

  // PAGE 2 — OVERVIEW + TWO MONTHLY GRAPHS
  pdf.addPage();
  addPageBackground(pdf);
  addPageHeader(pdf, "Analytics Overview", 2);

  let y = 34;
  y = addSectionTitle(pdf, "Analytics Overview", y);
  y = addMetricCards(pdf, reportData, y + 2);

  const spendChart = await captureBySelector("#monthlySpendChart");
  const energyChart = await captureBySelector("#monthlyEnergyChart");

  // Keep the monthly trend charts one below the other. This gives each
  // chart enough horizontal space for readable month labels and values,
  // while both complete charts still fit on a single A4 page.
  const chartX = MARGIN;
  const chartWidth = CONTENT_WIDTH;
  const chartHeight = 88;
  const chartGap = 6;

  if (spendChart) {
    await addChartImage(
      pdf,
      spendChart,
      chartX,
      y + 8,
      chartWidth,
      chartHeight
    );
  }

  if (energyChart) {
    const energyY = y + 8 + chartHeight + chartGap;

    await addChartImage(
      pdf,
      energyChart,
      chartX,
      energyY,
      chartWidth,
      chartHeight
    );
  }

  // PAGE 3 — WEEKLY ACTIVITY + CHARGING TYPE
  pdf.addPage();
  addPageBackground(pdf);
  addPageHeader(pdf, "Charging Activity", 3);

  y = addSectionTitle(pdf, "Charging Activity", 34);

  const weeklyChart = await captureBySelector("#weeklySessionsChart");
  const chargingTypeChart =
    await captureBySelector("#chargingTypeChart");

  if (weeklyChart) {
    await addChartImage(
      pdf,
      weeklyChart,
      MARGIN,
      y,
      CONTENT_WIDTH,
      105
    );
  }

  if (chargingTypeChart) {
    await addChartImage(
      pdf,
      chargingTypeChart,
      MARGIN,
      y + 112,
      CONTENT_WIDTH,
      105
    );
  }

  // PAGE 4 — MONTHLY + YEARLY + WEEKLY SUMMARIES
  pdf.addPage();
  addPageBackground(pdf);
  addPageHeader(pdf, "Summary Tables", 4);

  y = addSectionTitle(pdf, "Monthly Summary", 34);

  const monthly = monthRows(reportData?.monthlyStats);

  y = addTable(
    pdf,
    [["Month", "Sessions", "Energy (kWh)", "Spend"]],
    monthly.map((row) => [
      row.name,
      String(row.sessions),
      formatNumber(row.energy, 2),
      formatCurrency(row.cost),
    ]),
    y,
    {
      widths: [55, 30, 45, 60],
      fontSize: 8,
    }
  );

  const totalSessions = Number(reportData?.totalSessions || 0);
  const totalEnergy = Number(reportData?.totalEnergy || 0);
  const totalCost = Number(reportData?.totalCost || 0);

  addTable(
    pdf,
    [["TOTAL", "Sessions", "Energy", "Spend"]],
    [[
      "TOTAL",
      String(totalSessions),
      formatNumber(totalEnergy, 2),
      formatCurrency(totalCost),
    ]],
    y + 3,
    {
      widths: [55, 30, 45, 60],
      fontSize: 8,
    }
  );

  y = (pdf as any).lastAutoTable.finalY + 10;
  y = addSectionTitle(pdf, "Yearly Summary", y);

  const yearly = yearRows(reportData?.yearlyStats);

  y = addTable(
    pdf,
    [["Year", "Sessions", "Energy (kWh)", "Spend"]],
    yearly.map((row) => [
      row.name,
      String(row.sessions),
      formatNumber(row.energy, 2),
      formatCurrency(row.cost),
    ]),
    y,
    {
      widths: [55, 30, 45, 60],
      fontSize: 8,
    }
  );

  y = (pdf as any).lastAutoTable.finalY + 10;
  y = addSectionTitle(pdf, "Weekly Summary", y);

  addTable(
    pdf,
    [["Day", "Sessions"]],
    weeklyRows(reportData?.weeklyStats).map((row) => [
      row.name,
      String(row.sessions),
    ]),
    y,
    {
      widths: [105, 85],
      fontSize: 8,
    }
  );

  // PAGE 5 — VEHICLE + STATION STATISTICS
  pdf.addPage();
  addPageBackground(pdf);
  addPageHeader(pdf, "Statistics", 5);

  y = addSectionTitle(pdf, "Vehicle Statistics", 34);

  const vehicles = summaryRows(reportData?.vehicleStats);

  y = addTable(
    pdf,
    [["Vehicle", "Sessions", "Energy (kWh)", "Spend"]],
    vehicles.map((row) => [
      row.name,
      String(row.sessions),
      formatNumber(row.energy, 2),
      formatCurrency(row.cost),
    ]),
    y,
    {
      widths: [70, 30, 45, 45],
      fontSize: 8,
    }
  );

  y = (pdf as any).lastAutoTable.finalY + 12;
  y = addSectionTitle(pdf, "Charging Station Statistics", y);

  const stations = summaryRows(reportData?.stationStats);

  addTable(
    pdf,
    [["Station", "Sessions", "Energy (kWh)", "Spend"]],
    stations.map((row) => [
      row.name,
      String(row.sessions),
      formatNumber(row.energy, 2),
      formatCurrency(row.cost),
    ]),
    y,
    {
      widths: [70, 30, 45, 45],
      fontSize: 7.7,
    }
  );

  // PAGE 6+ — COMPLETE SESSION HISTORY
  const sessions = sessionRows(reportData?.sessions);
  const rowsPerPage = 25;

  for (
    let offset = 0;
    offset < sessions.length;
    offset += rowsPerPage
  ) {
    pdf.addPage();

    const pageNumber =
      (pdf as any).internal.getNumberOfPages();

    addPageBackground(pdf);
    addPageHeader(
      pdf,
      "Charging Session History",
      pageNumber
    );

    y = addSectionTitle(
      pdf,
      "Charging Session History",
      34
    );

    const chunk = sessions.slice(
      offset,
      offset + rowsPerPage
    );

    addTable(
      pdf,
      [[
        "#",
        "Date",
        "Vehicle",
        "Station",
        "Type",
        "Energy",
        "Spend",
      ]],
      chunk.map((session: any, index) => [
        String(offset + index + 1),
        String(session?.date || "-"),
        String(session?.vehicle || "-"),
        String(session?.station || "-"),
        String(session?.charger || "-"),
        formatEnergy(Number(session?.energy || 0)),
        formatCurrency(Number(session?.cost || 0)),
      ]),
      y,
      {
        widths: [10, 25, 35, 35, 25, 30, 30],
        fontSize: 6.6,
      }
    );
  }

  pdf.save("EVToolkit_Analytics_Report.pdf");
}

async function getCurrentUserDetails() {
  const {
    data,
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  const user = data.user;

  if (!user) {
    return {
      name: "User",
      email: "",
    };
  }

  const metadata =
    (user.user_metadata ?? {}) as Record<
      string,
      unknown
    >;

  const name =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : typeof metadata.display_name === "string"
          ? metadata.display_name
          : user.email?.split("@")[0] || "User";

  return {
    name: name.trim() || "User",
    email: user.email ?? "",
  };
}

function createReportSnapshot(reportData: any) {
  // Take one immutable snapshot at the moment Export PDF is clicked.
  // Every PDF section is then generated from this same snapshot so that
  // KPIs, charts, tables, and session history cannot drift between states.
  if (typeof structuredClone === "function") {
    return structuredClone(reportData);
  }

  return JSON.parse(JSON.stringify(reportData));
}

export default function ReportToolbar({
  reportData,
}: ReportToolbarProps) {
  const handleExportPDF = async () => {
    try {
      console.log("Export button clicked");

      const reportSnapshot =
        createReportSnapshot(reportData);

      const userDetails =
        await getCurrentUserDetails();

      reportSnapshot.userDetails = userDetails;

      await exportAnalyticsPDF(reportSnapshot);

      console.log("Analytics PDF generated and saved");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to generate PDF report.");
    }
  };

  return (
    <div className="reportToolbar">
      <button
        className="reportButton"
        onClick={handleExportPDF}
        type="button"
      >
        <FileText size={18} />
        Export PDF
      </button>
    </div>
  );
}
