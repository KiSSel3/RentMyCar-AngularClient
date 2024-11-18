import {Component, inject} from '@angular/core';
import {RentOffersService} from '../../services/rent-offers.service';
import {AlertService} from '../../../../core/services/alert.service';
import {FormBuilder} from '@angular/forms';
import {RentOfferDetailDTO} from '../../../../shared/dtos/rent-offer-detail.dto';
import {RentOfferParametersRequest} from '../../models/rent-offer-parameters.request';
import {PaginatedResult} from '../../../../shared/models/pagination.model';
import {NgForOf} from '@angular/common';
import {RentOfferCardComponent} from '../../../../shared/components/rent-offer-card/rent-offer-card.component';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    NgForOf,
    RentOfferCardComponent
  ],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css'
})
export class CatalogPageComponent {
  private readonly rentOffersService = inject(RentOffersService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  rentOffers: RentOfferDetailDTO[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadRentOffers();
  }

  loadRentOffers(): void {
    this.isLoading = true;

    const parameters: RentOfferParametersRequest = { };

    this.rentOffersService.getRentOffers(parameters)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (result: PaginatedResult<RentOfferDetailDTO>) => {
          this.rentOffers = result.collection
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
    this.loadRentOffers();
  }
}
