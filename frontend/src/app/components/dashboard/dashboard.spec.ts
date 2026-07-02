import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Dashboard } from './dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard-summary.model';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const mockSummary: DashboardSummary = {
    totalAllTime: 2585.75,
    totalThisMonth: 120,
    totalCount: 10,
    donationsByDate: [{ date: '2026-07-01', amount: 120 }],
    donationsByType: [{ type: 'ONLINE', amount: 560.25 }],
  };

  async function setup(dashboardServiceStub: Partial<DashboardService>) {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: DashboardService, useValue: dashboardServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup({ getSummary: () => of(mockSummary) });
    expect(component).toBeTruthy();
  });

  it('should render the three metric cards with values from the service', async () => {
    await setup({ getSummary: () => of(mockSummary) });

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Total Donations');
    expect(text).toContain('$2,585.75');
    expect(text).toContain('This Month');
    expect(text).toContain('$120.00');
    expect(text).toContain('Number of Donations');
    expect(text).toContain('10');
  });

  it('should show an error message when the request fails', async () => {
    await setup({ getSummary: () => throwError(() => new Error('network error')) });

    expect(fixture.nativeElement.textContent).toContain('Could not load dashboard data');
  });
});
