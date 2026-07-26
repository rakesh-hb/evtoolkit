export interface DocumentRecord {
    id: number;
    title: string;
    category: string;
    vehicle: string;
    documentDate: string;
    file: string;
    notes?: string;
    createdAt?: string;
  }