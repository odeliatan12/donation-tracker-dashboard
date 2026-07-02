import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { DonationList } from './components/donation-list/donation-list';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'donations', component: DonationList },
];
