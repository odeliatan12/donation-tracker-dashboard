import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

import { DonationForm } from './donation-form';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';

describe('DonationForm', () => {
  let component: DonationForm;
  let fixture: ComponentFixture<DonationForm>;
  let dialogRefStub: { close: ReturnType<typeof vi.fn> };
  let donationServiceStub: { create: ReturnType<typeof vi.fn> };

  const createdDonation: Donation = {
    id: 1,
    donorName: 'Jane Doe',
    amount: 100,
    date: '2026-07-02',
    type: 'ONLINE',
    notes: null,
  };

  async function setup(createResult: Observable<Donation>) {
    dialogRefStub = { close: vi.fn() };
    donationServiceStub = { create: vi.fn().mockReturnValue(createResult) };

    await TestBed.configureTestingModule({
      imports: [DonationForm],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: DonationService, useValue: donationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup(of(createdDonation));
    expect(component).toBeTruthy();
  });

  it('should start invalid and not submit when required fields are empty', async () => {
    await setup(of(createdDonation));

    component.onSubmit();

    expect(donationServiceStub.create).not.toHaveBeenCalled();
    expect(dialogRefStub.close).not.toHaveBeenCalled();
  });

  it('should submit a valid form and close the dialog with the created donation', async () => {
    await setup(of(createdDonation));

    component['form'].setValue({
      donorName: 'Jane Doe',
      amount: 100,
      date: new Date(2026, 6, 2),
      type: 'ONLINE',
      notes: '',
    });

    component.onSubmit();

    expect(donationServiceStub.create).toHaveBeenCalledWith({
      donorName: 'Jane Doe',
      amount: 100,
      date: '2026-07-02',
      type: 'ONLINE',
      notes: null,
    });
    expect(dialogRefStub.close).toHaveBeenCalledWith(createdDonation);
  });

  it('should show an error and not close the dialog when the save fails', async () => {
    await setup(throwError(() => new Error('network error')));

    component['form'].setValue({
      donorName: 'Jane Doe',
      amount: 100,
      date: new Date(2026, 6, 2),
      type: 'ONLINE',
      notes: '',
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(dialogRefStub.close).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Could not save the donation');
  });

  it('should close the dialog with no result on cancel', async () => {
    await setup(of(createdDonation));

    component.onCancel();

    expect(dialogRefStub.close).toHaveBeenCalledWith();
  });
});
