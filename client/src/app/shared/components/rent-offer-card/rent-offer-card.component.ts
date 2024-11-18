import {Component, Input} from '@angular/core';
import {RentOfferDetailDTO} from '../../dtos/rent-offer-detail.dto';
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

  prevImage() {
    this.currentImageIndex = this.currentImageIndex === 0 ?
      this.rentOffer.images.length - 1 :
      this.currentImageIndex - 1;
  }

  nextImage() {
    this.currentImageIndex = this.currentImageIndex === this.rentOffer.images.length - 1 ?
      0 :
      this.currentImageIndex + 1;
  }

  setImage(index: number) {
    this.currentImageIndex = index;
  }
}
