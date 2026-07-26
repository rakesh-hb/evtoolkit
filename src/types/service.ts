export interface ServiceRecord {
  id: number;
  vehicle: string;
  date: string;
  odometer: number;
  serviceType: string;
  serviceCenter: string;
  amount: number;
  notes?: string;
  attachment?: string;
}

export const serviceHistory: ServiceRecord[] = [];