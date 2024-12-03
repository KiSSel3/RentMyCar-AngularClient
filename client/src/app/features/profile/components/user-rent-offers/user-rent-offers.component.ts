import {Component, inject, OnInit} from '@angular/core';
import {RentOfferDetailDTO} from '../../../../core/data/dtos/responses/rent-offer-detail.dto';
import {NgForOf, NgIf} from '@angular/common';
import {RentOfferCardComponent} from '../../../catalog/components/rent-offer-card/rent-offer-card.component';
import {PaginatedResult} from '../../../../core/data/models/pagination.model';
import {PAGINATION_CONSTANTS} from '../../../../core/data/constants/pagination.constants';
import {RentOfferDTO} from '../../../../core/data/dtos/responses/rent-offer.dto';
import {RentOfferPreviewComponent} from '../rent-offer-preview/rent-offer-preview.component';
import {AlertService} from '../../../../core/services/alert.service';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../../core/services/auth.service';
import {catchError, finalize, of} from 'rxjs';
import {RentOfferService} from '../../../../core/services/rent-offer.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-rent-offers',
  standalone: true,
  imports: [
    NgIf,
    RentOfferCardComponent,
    NgForOf,
    RentOfferPreviewComponent,
    RouterLink
  ],
  templateUrl: './user-rent-offers.component.html',
  styleUrl: './user-rent-offers.component.css'
})
export class UserRentOffersComponent implements OnInit {
  private readonly rentOffersService = inject(RentOfferService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly FilterType = {
    ALL: 'all',
    ACTIVE: 'active',
    HIDDEN: 'hidden',
    RENTED: 'rented'
  } as const;

  currentFilter: string = this.FilterType.ALL;

  paginatedResult: PaginatedResult<RentOfferDTO> = {
    collection: [],
    currentPage: PAGINATION_CONSTANTS.DEFAULT_CURRENT_PAGE,
    pageSize: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE_PROFILE,
    totalPageCount: 0,
    totalItemCount: 0
  };

  isLoading = true;

  ngOnInit(): void {
    this.loadUserRentOffers();
  }

  loadUserRentOffers(): void {
    this.isLoading = true;

    const userId = this.authService.getUserId();
    const request = {
      pageNumber: this.paginatedResult.currentPage,
      pageSize: this.paginatedResult.pageSize,
      isAvailable: this.getIsAvailableFilter()
    };

    this.rentOffersService.getRentOffersByUserId(userId, request)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: PaginatedResult<RentOfferDTO>) => {
          this.paginatedResult = result;
        },
        error: (error) => {
          console.error('Failed to load user rent offers:', error);

          if (error.error?.errors) {
            const validationMessages = Object.keys(error.error.errors)
              .map(key => error.error.errors[key][0]);

            this.alertService.show(validationMessages[0], 'error');
          } else {
            this.alertService.show(
              error.error?.message || 'Failed to load user rent offers',
              'error'
            );
          }
        }
      });
  }

  setFilter(filter: string): void {
    if (this.currentFilter === filter) return;
    this.currentFilter = filter;
    this.paginatedResult.currentPage = 1;
    this.loadUserRentOffers();
  }

  onPageChange(page: number): void {
    this.paginatedResult.currentPage = page;
    this.loadUserRentOffers();
  }

  getPages(): number[] {
    return Array.from({length: this.paginatedResult.totalPageCount}, (_, i) => i + 1);
  }

  navigateToOffer(offerId: string): void {
    this.router.navigate(['/rent-offer', offerId]);
  }

  editOffer(event: Event, offerId: string): void {
    event.stopPropagation();
    this.router.navigate(['/profile/my-rent-offers', offerId]);
  }

  viewBookings(event: Event, offerId: string): void {
    event.stopPropagation();
    this.router.navigate(['/profile/rent-offer-bookings', offerId]);
  }

  private getIsAvailableFilter(): boolean | undefined {
    switch (this.currentFilter) {
      case this.FilterType.ACTIVE:
        return true;
      case this.FilterType.HIDDEN:
        return false;
      case this.FilterType.ALL:
        return undefined;
      case this.FilterType.RENTED:
        //TODO: добавить проверку брони
        return undefined;
      default:
        return undefined;
    }
  }
}
