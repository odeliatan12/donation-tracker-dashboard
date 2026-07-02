import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';
import { DonationForm, DonationFormData } from '../donation-form/donation-form';

@Component({
  selector: 'app-donation-list',
  imports: [MatTableModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe],
  templateUrl: './donation-list.html',
  styleUrl: './donation-list.scss',
})
export class DonationList implements OnInit {
  private readonly donationService = inject(DonationService);
  private readonly dialog = inject(MatDialog);

  protected readonly donations = signal<Donation[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly deleteError = signal(false);

  protected readonly displayedColumns = ['donorName', 'amount', 'date', 'type', 'notes', 'actions'];

  ngOnInit(): void {
    this.loadDonations();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DonationForm, { width: '480px' });
    dialogRef.afterClosed().subscribe((result: Donation | undefined) => {
      if (result) {
        this.donations.update((current) => [...current, result]);
      }
    });
  }

  openEditDialog(donation: Donation): void {
    const dialogRef = this.dialog.open<DonationForm, DonationFormData, Donation | undefined>(DonationForm, {
      width: '480px',
      data: { donation },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.donations.update((current) => current.map((d) => (d.id === result.id ? result : d)));
      }
    });
  }

  deleteDonation(donation: Donation): void {
    const confirmed = window.confirm(`Delete the donation from ${donation.donorName}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.deleteError.set(false);
    this.donationService.delete(donation.id).subscribe({
      next: () => {
        this.donations.update((current) => current.filter((d) => d.id !== donation.id));
      },
      error: () => {
        this.deleteError.set(true);
      },
    });
  }

  private loadDonations(): void {
    this.loading.set(true);
    this.donationService.getAll().subscribe({
      next: (donations) => {
        this.donations.set(donations);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
