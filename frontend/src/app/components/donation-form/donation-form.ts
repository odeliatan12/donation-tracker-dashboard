import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DonationService } from '../../services/donation.service';
import { Donation, DonationRequest, DonationType } from '../../models/donation.model';

export interface DonationFormData {
  donation?: Donation;
}

@Component({
  selector: 'app-donation-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextFieldModule,
  ],
  templateUrl: './donation-form.html',
  styleUrl: './donation-form.scss',
})
export class DonationForm {
  private readonly fb = inject(FormBuilder);
  private readonly donationService = inject(DonationService);
  private readonly dialogRef = inject(MatDialogRef<DonationForm>);
  private readonly data = inject<DonationFormData>(MAT_DIALOG_DATA, { optional: true });

  private readonly editingDonation = this.data?.donation ?? null;
  protected readonly isEditMode = this.editingDonation !== null;

  protected readonly donationTypes: DonationType[] = ['CASH', 'ONLINE', 'EVENT'];
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    donorName: [this.editingDonation?.donorName ?? '', Validators.required],
    amount: this.fb.control<number | null>(
      this.editingDonation?.amount ?? null,
      [Validators.required, Validators.min(0.01)]
    ),
    date: [
      this.editingDonation ? this.parseIsoDate(this.editingDonation.date) : new Date(),
      Validators.required,
    ],
    type: this.fb.nonNullable.control<DonationType>(this.editingDonation?.type ?? 'ONLINE', Validators.required),
    notes: [this.editingDonation?.notes ?? ''],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request: DonationRequest = {
      donorName: value.donorName,
      amount: value.amount!,
      date: this.toIsoDate(value.date),
      type: value.type,
      notes: value.notes || null,
    };

    this.saving.set(true);
    this.saveError.set(false);

    const result$ = this.editingDonation
      ? this.donationService.update(this.editingDonation.id, request)
      : this.donationService.create(request);

    result$.subscribe({
      next: (donation: Donation) => {
        this.saving.set(false);
        this.dialogRef.close(donation);
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseIsoDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
