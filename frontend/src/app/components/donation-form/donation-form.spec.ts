import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DonationForm, DonationFormData } from './donation-form';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';

describe('DonationForm', () => {
  let component: DonationForm;
  let fixture: ComponentFixture<DonationForm>;
  let dialogRefStub: { close: ReturnType<typeof vi.fn> };
  let donationServiceStub: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };

  const createdDonation: Donation = {
    id: 1,
    donorName: 'Jane Doe',
    amount: 100,
    date: '2026-07-02',
    type: 'ONLINE',
    notes: null,
  };

  const existingDonation: Donation = {
    id: 5,
    donorName: 'John Smith',
    amount: 75.5,
    date: '2026-06-20',
    type: 'CASH',
    notes: 'existing note',
  };

  async function setup(result$: Observable<Donation>, dialogData: DonationFormData = {}) {
    dialogRefStub = { close: vi.fn() };
    donationServiceStub = {
      create: vi.fn().mockReturnValue(result$),
      update: vi.fn().mockReturnValue(result$),
    };

    await TestBed.configureTestingModule({
      imports: [DonationForm],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: DonationService, useValue: donationServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
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

  it('should pre-fill the form when editing an existing donation', async () => {
    await setup(of(existingDonation), { donation: existingDonation });

    expect(component['isEditMode']).toBe(true);
    expect(component['form'].getRawValue()).toEqual({
      donorName: 'John Smith',
      amount: 75.5,
      date: new Date(2026, 5, 20),
      type: 'CASH',
      notes: 'existing note',
    });
    expect(fixture.nativeElement.textContent).toContain('Edit Donation');
  });

  it('should call update, not create, when editing', async () => {
    await setup(of(existingDonation), { donation: existingDonation });

    component['form'].patchValue({ amount: 90 });
    component.onSubmit();

    expect(donationServiceStub.update).toHaveBeenCalledWith(5, {
      donorName: 'John Smith',
      amount: 90,
      date: '2026-06-20',
      type: 'CASH',
      notes: 'existing note',
    });
    expect(donationServiceStub.create).not.toHaveBeenCalled();
    expect(dialogRefStub.close).toHaveBeenCalledWith(existingDonation);
  });
});
