import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DonationService } from './donation.service';
import { environment } from '../../environments/environment';
import { Donation, DonationRequest } from '../models/donation.model';

describe('DonationService', () => {
  let service: DonationService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/donations`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DonationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should GET the donations list', () => {
    const mockDonations: Donation[] = [
      { id: 1, donorName: 'Jane Doe', amount: 100, date: '2026-07-01', type: 'ONLINE' },
    ];

    service.getAll().subscribe((donations) => {
      expect(donations).toEqual(mockDonations);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockDonations);
  });

  it('create() should POST a new donation', () => {
    const request: DonationRequest = { donorName: 'Jane Doe', amount: 100, date: '2026-07-01', type: 'ONLINE' };
    const created: Donation = { id: 1, ...request };

    service.create(request).subscribe((donation) => {
      expect(donation).toEqual(created);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(created);
  });

  it('update() should PUT to the donation id', () => {
    const request: DonationRequest = { donorName: 'Jane Doe', amount: 150, date: '2026-07-01', type: 'CASH' };
    const updated: Donation = { id: 1, ...request };

    service.update(1, request).subscribe((donation) => {
      expect(donation).toEqual(updated);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(updated);
  });

  it('delete() should DELETE the donation id', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
