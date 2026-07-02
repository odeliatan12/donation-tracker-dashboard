import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Donation, DonationRequest } from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/donations`;

  getAll(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.baseUrl);
  }

  create(request: DonationRequest): Observable<Donation> {
    return this.http.post<Donation>(this.baseUrl, request);
  }

  update(id: number, request: DonationRequest): Observable<Donation> {
    return this.http.put<Donation>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
