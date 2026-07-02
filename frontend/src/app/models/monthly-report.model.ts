export interface DonorTotal {
  donorName: string;
  totalAmount: number;
}

export interface MonthlyReport {
  month: string;
  totalAmount: number;
  donationCount: number;
  topDonors: DonorTotal[];
}
