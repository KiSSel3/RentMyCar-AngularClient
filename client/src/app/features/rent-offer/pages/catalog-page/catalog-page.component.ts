import {Component, inject, OnInit} from '@angular/core';
import {RentOffersService} from '../../../../core/services/rent-offer.service';
import {AlertService} from '../../../../core/services/alert.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RentOfferDetailDTO} from '../../../../core/data/dtos/responses/rent-offer-detail.dto';
import {RentOfferParametersRequestDTO} from '../../../../core/data/dtos/requests/rent-offer-parameters.request.dto';
import {PaginatedResult} from '../../../../core/data/models/pagination.model';
import {NgForOf, NgIf} from '@angular/common';
import {RentOfferCardComponent} from '../../components/rent-offer-card/rent-offer-card.component';
import {debounceTime, distinctUntilChanged, finalize} from 'rxjs';
import {PAGINATION_CONSTANTS} from '../../../../core/data/constants/pagination.constants';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    NgForOf,
    RentOfferCardComponent,
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css'
})
export class CatalogPageComponent implements OnInit {
  private readonly rentOffersService = inject(RentOffersService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  paginatedResult: PaginatedResult<RentOfferDetailDTO> = {
    collection: [],
    currentPage: PAGINATION_CONSTANTS.DEFAULT_CURRENT_PAGE,
    pageSize: PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE,
    totalPageCount: 0,
    totalItemCount: 0
  };

  isLoading = true;

  filterForm = this.fb.group({
    city: [''],
    street: [''],
    minPrice: [''],
    maxPrice: [''],
    availableFrom: [''],
    availableTo: ['']
  });

  ngOnInit(): void {
    this.initializeFilters();
    this.loadRentOffers();
  }

  loadRentOffers(): void {
    this.isLoading = true;

    const formValues = this.filterForm.value;
    const parameters: RentOfferParametersRequestDTO = {
      pageNumber: this.paginatedResult.currentPage,
      pageSize: this.paginatedResult.pageSize,
      city: formValues.city || undefined,
      street: formValues.street || undefined,
      minPrice: formValues.minPrice ? Number(formValues.minPrice) : undefined,
      maxPrice: formValues.maxPrice ? Number(formValues.maxPrice) : undefined,
      availableFrom: formValues.availableFrom ? new Date(formValues.availableFrom) : undefined,
      availableTo: formValues.availableTo ? new Date(formValues.availableTo) : undefined
    };

    this.rentOffersService.getRentOffers(parameters)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: PaginatedResult<RentOfferDetailDTO>) => {
          this.paginatedResult = result;
        },
        error: (error) => {
          console.error('Failed to load rent offers:', error);

          if (error.error?.errors) {
            const validationMessages = Object.keys(error.error.errors)
              .map(key => error.error.errors[key][0]);

            this.alertService.show(validationMessages[0], 'error');
          } else {
            this.alertService.show(
              error.error?.message || 'Failed to load rent offers',
              'error'
            );
          }
        }
      });
  }

  onPageChange(page: number): void {
    this.paginatedResult.currentPage = page;
    this.loadRentOffers();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.paginatedResult.currentPage = 1;
    this.loadRentOffers();
  }

  getPages(): number[] {
    return Array.from({length: this.paginatedResult.totalPageCount}, (_, i) => i + 1);
  }

  private initializeFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.paginatedResult.currentPage = 1;
        this.loadRentOffers();
      });
  }
}
