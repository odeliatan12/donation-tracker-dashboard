export type DonationType = 'CASH' | 'ONLINE' | 'EVENT';

export interface Donation {
  id: number;
  donorName: string;
  amount: number;
  date: string;
  type: DonationType;
  notes?: string | null;
}

export interface DonationRequest {
  donorName: string;
  amount: number;
  date: string;
  type: DonationType;
  notes?: string | null;
}
