import type {
    AnalyticsReport,
    SummaryStats,
    ChargingSessionReport,
  } from "./ReportTypes";
  
  interface ReportInput {
    totalSessions: number;
    totalEnergy: number;
    totalCost: number;
    averageEnergy: number;
    averageCost: number;
    estimatedRange: number;
  
    vehicleStats: Record<string, SummaryStats>;
    stationStats: Record<string, SummaryStats>;
    monthlyStats: Record<string, SummaryStats>;
    yearlyStats: Record<string, SummaryStats>;
    weeklyStats: Record<string, number>;
  
    sessions: ChargingSessionReport[];
  }
  
  export function generateAnalyticsReport(
    data: ReportInput
  ): AnalyticsReport {
    return {
      generatedOn: new Date(),
  
      summary: {
        totalSessions: data.totalSessions,
        totalEnergy: data.totalEnergy,
        totalCost: data.totalCost,
        averageEnergy: data.averageEnergy,
        averageCost: data.averageCost,
        estimatedRange: data.estimatedRange,
  
        petrolSaved: data.totalEnergy / 14,
        carbonSaved: data.totalEnergy * 0.82,
      },
  
      vehicles: data.vehicleStats,
  
      stations: data.stationStats,
  
      monthly: data.monthlyStats,
  
      yearly: data.yearlyStats,
  
      weekly: data.weeklyStats,
  
      sessions: data.sessions,
    };
  }