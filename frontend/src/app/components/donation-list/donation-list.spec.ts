import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DonationList } from './donation-list';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';

describe('DonationList', () => {
  let component: DonationList;
  let fixture: ComponentFixture<DonationList>;

  const mockDonations: Donation[] = [
    { id: 1, donorName: 'Jane Doe', amount: 150, date: '2026-06-15', type: 'ONLINE', notes: 'first gift' },
    { id: 2, donorName: 'John Smith', amount: 75.5, date: '2026-06-20', type: 'CASH', notes: null },
  ];

  async function setup(donationServiceStub: Partial<DonationService>) {
    await TestBed.configureTestingModule({
      imports: [DonationList],
      providers: [{ provide: DonationService, useValue: donationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup({ getAll: () => of([]) });
    expect(component).toBeTruthy();
  });

  it('should render a row per donation returned by the service', async () => {
    await setup({ getAll: () => of(mockDonations) });

    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Jane Doe');
    expect(fixture.nativeElement.textContent).toContain('John Smith');
  });

  it('should show an empty state when there are no donations', async () => {
    await setup({ getAll: () => of([]) });

    expect(fixture.nativeElement.textContent).toContain('No donations yet.');
  });

  it('should show an error message when the request fails', async () => {
    await setup({ getAll: () => throwError(() => new Error('network error')) });

    expect(fixture.nativeElement.textContent).toContain('Could not load donations');
  });
});
