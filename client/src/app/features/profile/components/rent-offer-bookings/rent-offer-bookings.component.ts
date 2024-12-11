import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';
import { BookingDTO } from '../../../../core/data/dtos/responses/booking.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { finalize } from 'rxjs';
import { NgIf, NgForOf, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { BookingCardComponent } from '../../../../shared/components/booking-card/booking-card.component';
import { BookingStatus } from '../../../../core/data/enums/booking-status.enum';
import {UpdateBookingFormComponent} from '../update-booking-form/update-booking-form.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-rent-offer-bookings',
  standalone: true,
  imports: [
    BookingCardComponent,
    NgIf,
    NgForOf,
    KeyValuePipe,
    TitleCasePipe
  ],
  templateUrl: './rent-offer-bookings.component.html',
  styleUrl: './rent-offer-bookings.component.css',
})
export class RentOfferBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  bookings: BookingDTO[] = [];
  isLoading = true;
  rentOfferId!: string;

  readonly FilterType = {
    PENDING: BookingStatus.Pending.toString(),
    CONFIRMED: BookingStatus.Confirmed.toString(),
    CANCELED: BookingStatus.Canceled.toString(),
    COMPLETED: BookingStatus.Completed.toString(),
    ARCHIVED: 'Archived',
  } as const;

  currentFilter: string = this.FilterType.CONFIRMED;

  ngOnInit(): void {
    this.rentOfferId = this.route.snapshot.paramMap.get('id') || '';
    if (this.rentOfferId) {
      this.loadRentOfferBookings();
    } else {
      this.alertService.show('Invalid rent offer ID.', 'error');
      this.router.navigate(['/']);
    }
  }

  private loadRentOfferBookings(): void {
    this.isLoading = true;

    this.bookingService
      .getBookings(this.getFilterParams(this.rentOfferId, this.currentFilter))
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (bookings) => {
          this.bookings = this.sortBookingsByStartDate(bookings, this.currentFilter);
        },
        error: (error) => {
          console.error('Failed to load bookings:', error);

          if (error.error?.errors) {
            const validationMessages = Object.keys(error.error.errors)
              .map((key) => error.error.errors[key][0]);

            this.alertService.show(validationMessages[0], 'error');
          } else {
            this.alertService.show(
              error.error?.error || error.error?.message || 'An error occurred while loading bookings',
              'error'
            );
          }
        },
      });
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.loadRentOfferBookings();
  }

  openUpdateBookingDialog(bookingId: string, currentStatus: string): void {
    const dialogRef = this.dialog.open(UpdateBookingFormComponent, {
      width: '500px',
      data: { bookingId, currentStatus },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  private getFilterParams(rentOfferId: string, filter: string): any {
    const now = new Date();

    if (filter === this.FilterType.ARCHIVED) {
      return {
        rentOfferId,
        endDateTo: new Date(now.setDate(now.getDate() - 1)),
      };
    } else {
      return {
        rentOfferId,
        status: filter,
        endDateFrom: new Date(now.setDate(now.getDate() - 1)),
      };
    }
  }

  private sortBookingsByStartDate(bookings: BookingDTO[], filter: string): BookingDTO[] {
    return bookings.sort((a, b) => {
      const dateA = new Date(a.rentalStart).getTime();
      const dateB = new Date(b.rentalStart).getTime();

      if (filter === this.FilterType.ARCHIVED) {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }
}
