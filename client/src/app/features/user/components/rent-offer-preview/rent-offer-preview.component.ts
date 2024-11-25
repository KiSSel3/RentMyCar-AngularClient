import {Component, Input} from '@angular/core';
import {RentOfferDTO} from '../../../../core/data/dtos/responses/rent-offer.dto';

@Component({
  selector: 'app-rent-offer-preview',
  standalone: true,
  imports: [],
  templateUrl: './rent-offer-preview.component.html',
  styleUrl: './rent-offer-preview.component.css'
})
export class RentOfferPreviewComponent {
  @Input() rentOffer!: RentOfferDTO;

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
