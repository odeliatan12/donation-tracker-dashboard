import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ReportService } from './report.service';
import { environment } from '../../environments/environment';
import { MonthlyReport } from '../models/monthly-report.model';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/reports`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMonthlyReport() with no month should GET without a month param', () => {
    const mockReport: MonthlyReport = {
      month: '2026-07',
      totalAmount: 120,
      donationCount: 1,
      topDonors: [{ donorName: 'Jane Doe', totalAmount: 120 }],
    };

    service.getMonthlyReport().subscribe((report) => {
      expect(report).toEqual(mockReport);
    });

    const req = httpMock.expectOne(`${baseUrl}/monthly`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('month')).toBe(false);
    req.flush(mockReport);
  });

  it('getMonthlyReport(month) should GET with the month query param', () => {
    const mockReport: MonthlyReport = {
      month: '2026-04',
      totalAmount: 725.5,
      donationCount: 3,
      topDonors: [{ donorName: 'Acme Corp', totalAmount: 500 }],
    };

    service.getMonthlyReport('2026-04').subscribe((report) => {
      expect(report).toEqual(mockReport);
    });

    const req = httpMock.expectOne(`${baseUrl}/monthly?month=2026-04`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('month')).toBe('2026-04');
    req.flush(mockReport);
  });
});
