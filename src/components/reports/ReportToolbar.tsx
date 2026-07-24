import { FileText } from "lucide-react";

import {
  generateAnalyticsReport,
  exportPDF,
} from "../../reports";

import { captureChart } from "../../reports/ChartExporter";

interface ReportToolbarProps {
  reportData: any;
}

export default function ReportToolbar({
  reportData,
}: ReportToolbarProps) {

  const handleExportPDF = async () => {
    try {
      console.log("Export button clicked");

      const report = generateAnalyticsReport(reportData);

      const charts = await Promise.all([
        captureChart("monthlySpendChart"),
        captureChart("monthlyEnergyChart"),
        captureChart("weeklyChart"),
        captureChart("chargingTypeChart"),
      ]);

      const validCharts = charts.filter(
        (chart): chart is string => chart !== null
      );

      console.log("Charts captured:", validCharts.length);

      const pdf = await exportPDF(report, validCharts);

      console.log("PDF generated");

      pdf.save("EVToolkit_Analytics_Report.pdf");

      console.log("PDF saved");
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
      >
        <FileText size={18} />
        Export PDF
      </button>
    </div>
  );
}