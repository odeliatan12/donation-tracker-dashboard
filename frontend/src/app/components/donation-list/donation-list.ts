import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation.model';

@Component({
  selector: 'app-donation-list',
  imports: [MatTableModule, MatProgressSpinnerModule, CurrencyPipe, DatePipe],
  templateUrl: './donation-list.html',
  styleUrl: './donation-list.scss',
})
export class DonationList implements OnInit {
  private readonly donationService = inject(DonationService);

  protected readonly donations = signal<Donation[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  protected readonly displayedColumns = ['donorName', 'amount', 'date', 'type', 'notes'];

  ngOnInit(): void {
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
