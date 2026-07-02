import { DonationType } from './donation.model';

export interface DailyTotal {
  date: string;
  amount: number;
}

export interface TypeTotal {
  type: DonationType;
  amount: number;
}

export interface DashboardSummary {
  totalAllTime: number;
  totalThisMonth: number;
  totalCount: number;
  donationsByDate: DailyTotal[];
  donationsByType: TypeTotal[];
}
