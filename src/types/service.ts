export interface ServiceRecord {
    id: number;
    date: string;
    odometer: number;
    serviceType: string;
    serviceCenter: string;
    amount: number;
    nextServiceKm: number;
    nextServiceDate: string;
    notes?: string;
    attachment?: string;
  }
  
  export const serviceHistory: ServiceRecord[] = [];