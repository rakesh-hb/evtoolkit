export interface TyreRecord {
    id: number;
    date: string;
    odometer: number;
    action: string;
    brand: string;
    model: string;
    position: string;
    cost: number;
    notes?: string;
  }
  
  export const tyreHistory: TyreRecord[] = [];