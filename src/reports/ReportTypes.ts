export interface SummaryStats {
    sessions: number;
    energy: number;
    cost: number;
  }
  
  export interface ChargingSessionReport {
    date: string;
    vehicle: string;
    station: string;
    charger: string;
    energy: number;
    cost: number;
  }
  
  export interface AnalyticsReport {
    generatedOn: Date;
  
    summary: {
      totalSessions: number;
      totalEnergy: number;
      totalCost: number;
      averageEnergy: number;
      averageCost: number;
      estimatedRange: number;
      petrolSaved: number;
      carbonSaved: number;
    };
  
    vehicles: Record<string, SummaryStats>;
  
    stations: Record<string, SummaryStats>;
  
    monthly: Record<string, SummaryStats>;
  
    yearly: Record<string, SummaryStats>;
  
    weekly: Record<string, number>;
  
    sessions: ChargingSessionReport[];
  }