import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {RentOfferDetailDTO} from '../../../../core/data/dtos/responses/rent-offer-detail.dto';
import {finalize, forkJoin} from 'rxjs';
import {ReviewDTO} from '../../../../core/data/dtos/responses/review.dto';
import {BookingService} from '../../../../core/services/booking.service';
import {ReviewService} from '../../../../core/services/review.service';
import {RentOfferService} from '../../../../core/services/rent-offer.service';
import {ReviewParametersRequestDTO} from '../../../../core/data/dtos/requests/review-parameters.request.dto';
import {CommonModule, CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {UserDTO} from '../../../profile/dtos/user.dto';
import {UserService} from '../../../profile/services/user.service';
import {MatCalendar, MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {AlertService} from '../../../../core/services/alert.service';
import {BookingFormComponent} from '../../components/booking-form/booking-form.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../core/services/auth.service';
import {CreateReviewFormComponent} from '../../components/create-review-form/create-review-form.component';
import {UpdateReviewFormComponent} from '../../components/update-review-form/update-review-form.component';
import {ReviewManagementService} from '../../services/review-management.service';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    NgIf,
    NgForOf,
    MatCalendar
  ],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly rentOfferService = inject(RentOfferService);
  private readonly reviewService = inject(ReviewService);
  private readonly reviewManagementService = inject(ReviewManagementService);
  private readonly bookingService = inject(BookingService);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  rentOffer!: RentOfferDetailDTO;
  reviews: ReviewDTO[] = [];
  user!: UserDTO;
  availableDates: Date[] = [];
  selectedImage?: string;
  averageRating: number = 0;
  selectedDate: Date | null = null;
  isLoading = true;

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.loadData(offerId);
    }
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const isAvailable = this.availableDates.some(date =>
        this.isSameDay(new Date(date), cellDate)
      );
      return isAvailable ? 'available-date' : '';
    }
    return '';
  };

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return this.availableDates.some(availableDate =>
      this.isSameDay(new Date(availableDate), date)
    );
  };

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  openBookingDialog(): void {
    console.log(this.availableDates)

    const dialogRef = this.dialog.open(BookingFormComponent, {
      width: '500px',
      data: {
        userId: this.authService.getUserId(),
        rentOfferId: this.rentOffer.id,
        availableDates: this.availableDates
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(CreateReviewFormComponent, {
      width: '500px',
      data: { rentOfferId: this.rentOffer.id, userId: this.authService.getUserId() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  editReview(review: ReviewDTO): void {
    const dialogRef = this.dialog.open(UpdateReviewFormComponent, {
      width: '500px',
      data: { reviewId: review.id, rating: review.rating, comment: review.comment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewManagementService.deleteReview(reviewId).subscribe({
        next: () => {
          this.alertService.show('Review deleted successfully!', 'success');
          window.location.reload();
        },
        error: (err) => {
          this.alertService.show('Failed to delete review.', 'error');
          console.error(err);
        }
      });
    }
  }

  isOwner(review: ReviewDTO): boolean {
    return this.authService.getUserId() === review.reviewerId;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  private loadData(offerId: string): void {
    const reviewParams: ReviewParametersRequestDTO = {
      rentOfferId: offerId
    };

    forkJoin({
      offer: this.rentOfferService.getRentOfferDetailsById(offerId),
      reviews: this.reviewService.getReviews(reviewParams),
      dates: this.bookingService.getAvailableDates(offerId)
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.rentOffer = data.offer;
        this.reviews = data.reviews.collection;
        this.availableDates = data.dates.map(date => new Date(date));
        this.selectedImage = this.rentOffer.images[0]?.image;
        this.calculateAverageRating();

        if (this.rentOffer.userId) {
          this.userService.getUserById(this.rentOffer.userId).subscribe({
            next: (user) => {
              this.user = user;
            },
            error: (error) => {
              console.error('Error loading user details:', error);
              this.handleError(error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading rent offer details:', error);
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    if (error.error?.errors) {
      const validationMessages = Object.keys(error.error.errors)
        .map(key => error.error.errors[key][0]);

      this.alertService.show(validationMessages[0], 'error');
    } else {
      this.alertService.show(
        error.error?.error ||
        error.error?.message ||
        'An error occurred while loading the data',
        'error'
      );
    }
  }

  private calculateAverageRating(): void {
    if (this.reviews.length) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = sum / this.reviews.length;
    }
  }
}
