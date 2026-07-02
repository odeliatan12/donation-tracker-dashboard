import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DashboardService } from './dashboard.service';
import { environment } from '../../environments/environment';
import { DashboardSummary } from '../models/dashboard-summary.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/dashboard`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSummary() should GET the dashboard summary', () => {
    const mockSummary: DashboardSummary = {
      totalAllTime: 2585.75,
      totalThisMonth: 120,
      totalCount: 10,
      donationsByDate: [{ date: '2026-07-01', amount: 120 }],
      donationsByType: [{ type: 'ONLINE', amount: 560.25 }],
    };

    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual(mockSummary);
    });

    const req = httpMock.expectOne(`${baseUrl}/summary`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSummary);
  });
});
