import {Component, inject, OnInit} from '@angular/core';
import {BookingService} from '../../../../core/services/booking.service';
import {BookingDTO} from '../../../../core/data/dtos/responses/booking.dto';
import {AuthService} from '../../../../core/services/auth.service';
import {BookingCardComponent} from '../../../../shared/components/booking-card/booking-card.component';
import {KeyValuePipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {BookingStatus} from '../../../../core/data/enums/booking-status.enum';
import {EventDTO} from '../../../../core/data/dtos/responses/event.dto';
import {AlertService} from '../../../../core/services/alert.service';
import {finalize} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [
    BookingCardComponent,
    NgForOf,
    NgIf,
    KeyValuePipe,
    TitleCasePipe
  ],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css'
})
export class UserBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  bookings: BookingDTO[] = [];
  isLoading = true;

  readonly FilterType = {
    PENDING: BookingStatus.Pending.toString(),
    CONFIRMED: BookingStatus.Confirmed.toString(),
    CANCELED: BookingStatus.Canceled.toString(),
    COMPLETED: BookingStatus.Completed.toString(),
    ARCHIVED: 'Аrchived',
  } as const;

  currentFilter: string = this.FilterType.CONFIRMED;

  ngOnInit(): void {
    this.loadUserBookings();
  }

  private loadUserBookings(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    this.bookingService
      .getBookings(this.getFilterParams(userId, this.currentFilter))
      .pipe(
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (bookings) => {
          this.bookings = this.sortBookingsByStartDate(bookings, this.currentFilter);
        },
        error: (error) => {
          console.error('Failed to load bookings:', error);

          if (error.error?.errors) {
            const validationMessages = Object.keys(error.error.errors)
              .map(key => error.error.errors[key][0]);

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
    this.loadUserBookings();
  }

  private getFilterParams(userId: string, filter: string): any {
    const now = new Date();

    if (filter === this.FilterType.ARCHIVED) {
      return {
        userId,
        endDateTo: new Date(now.setDate(now.getDate() - 1))
      };
    }
    else {
      return {
        userId,
        status: filter,
        endDateFrom: new Date(now.setDate(now.getDate() - 1))
      };
    }
  }

  navigateToOffer(offerId: string): void {
    this.router.navigate(['/rent-offer', offerId]);
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
