import {Component, Input} from '@angular/core';
import {RentOfferDetailDTO} from '../../../../shared/dtos/rent-offer-detail.dto';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-rent-offer-card',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './rent-offer-card.component.html',
  styleUrl: './rent-offer-card.component.css'
})
export class RentOfferCardComponent {
  @Input() rentOffer!: RentOfferDetailDTO;

  currentImageIndex = 0;

  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentImageIndex = this.currentImageIndex === 0 ?
      this.rentOffer.images.length - 1 :
      this.currentImageIndex - 1;
  }

  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentImageIndex = this.currentImageIndex === this.rentOffer.images.length - 1 ?
      0 :
      this.currentImageIndex + 1;
  }

  setImage(index: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentImageIndex = index;
  }
}
