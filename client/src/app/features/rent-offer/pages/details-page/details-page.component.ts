import {Component, inject, OnInit} from '@angular/core';
import {RentOffersService} from '../../../../core/services/rent-offers.service';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../../../../core/services/alert.service';
import {RentOfferDetailDTO} from '../../../../core/data/dtos/responses/rent-offer-detail.dto';
import {finalize} from 'rxjs';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    DatePipe,
    NgForOf
  ],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  private readonly rentOffersService = inject(RentOffersService);
  private readonly route = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);

  rentOffer?: RentOfferDetailDTO;
  currentImageIndex = 0;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRentOfferDetails(id);
    }
  }

  private loadRentOfferDetails(id: string): void {
    this.rentOffersService.getRentOfferDetailsById(id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (offer) => {
          this.rentOffer = offer;
        },
        error: (error) => {
          console.error('Failed to load rent offer details:', error);
          this.alertService.show(
            error.error?.message || 'Failed to load rent offer details',
            'error'
          );
        }
      });
  }

  nextImage(): void {
    if (this.rentOffer?.images?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.rentOffer.images.length;
    }
  }

  prevImage(): void {
    if (this.rentOffer?.images?.length) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.rentOffer.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
