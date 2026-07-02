import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { DonationList } from './donation-list';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';

describe('DonationList', () => {
  let component: DonationList;
  let fixture: ComponentFixture<DonationList>;
  let donationServiceStub: Partial<DonationService>;
  let dialogStub: { open: ReturnType<typeof vi.fn> };

  const mockDonations: Donation[] = [
    { id: 1, donorName: 'Jane Doe', amount: 150, date: '2026-06-15', type: 'ONLINE', notes: 'first gift' },
    { id: 2, donorName: 'John Smith', amount: 75.5, date: '2026-06-20', type: 'CASH', notes: null },
  ];

  async function setup(serviceOverrides: Partial<DonationService>, dialogAfterClosedResult: unknown = undefined) {
    donationServiceStub = { getAll: () => of(mockDonations), ...serviceOverrides };
    dialogStub = { open: vi.fn().mockReturnValue({ afterClosed: () => of(dialogAfterClosedResult) }) };

    await TestBed.configureTestingModule({
      imports: [DonationList],
      providers: [
        { provide: DonationService, useValue: donationServiceStub },
        { provide: MatDialog, useValue: dialogStub },
      ],
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
    await setup({});

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

  it('should open the edit dialog with the selected donation and apply the result', async () => {
    const updated: Donation = { ...mockDonations[0], amount: 999 };
    await setup({}, updated);

    component.openEditDialog(mockDonations[0]);

    expect(dialogStub.open).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { donation: mockDonations[0] } })
    );
    expect(component['donations']().find((d) => d.id === 1)?.amount).toBe(999);
  });

  it('should not change the list when the edit dialog is cancelled', async () => {
    await setup({}, undefined);

    component.openEditDialog(mockDonations[0]);

    expect(component['donations']()).toEqual(mockDonations);
  });

  it('should delete a donation after confirmation', async () => {
    const deleteSpy = vi.fn().mockReturnValue(of(undefined));
    await setup({ delete: deleteSpy });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteDonation(mockDonations[0]);

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(component['donations']().find((d) => d.id === 1)).toBeUndefined();
  });

  it('should not delete when the user cancels the confirmation', async () => {
    const deleteSpy = vi.fn().mockReturnValue(of(undefined));
    await setup({ delete: deleteSpy });
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteDonation(mockDonations[0]);

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(component['donations']().length).toBe(2);
  });

  it('should show an error when delete fails', async () => {
    const deleteSpy = vi.fn().mockReturnValue(throwError(() => new Error('network error')));
    await setup({ delete: deleteSpy });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteDonation(mockDonations[0]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Could not delete the donation');
    expect(component['donations']().length).toBe(2);
  });
});
