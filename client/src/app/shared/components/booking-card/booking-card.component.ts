import {Component, inject, Input, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {BookingDTO} from '../../../core/data/dtos/responses/booking.dto';
import {EventDTO} from '../../../core/data/dtos/responses/event.dto';
import {BookingStatus} from '../../../core/data/enums/booking-status.enum';
import {RentOfferService} from '../../../core/services/rent-offer.service';
import {RentOfferDetailDTO} from '../../../core/data/dtos/responses/rent-offer-detail.dto';


@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css'
})
export class BookingCardComponent implements OnInit {
  private readonly rentOfferService = inject(RentOfferService);

  @Input() booking!: BookingDTO;

  carModel: string | undefined;
  brandName: string | undefined;

  ngOnInit(): void {
    this.loadCarDetails();
  }

  loadCarDetails(): void {
    this.rentOfferService.getRentOfferDetailsById(this.booking.rentOfferId).subscribe({
      next: (rentOffer: RentOfferDetailDTO) => {
        this.carModel = rentOffer.car.carModel.name;
        this.brandName = rentOffer.car.carModel.brand.name;
      },
      error: () => {
        console.error('Failed to load car details');
      }
    });
  }
  getCurrentStatus(events: EventDTO[]): BookingStatus {
    return events[events.length - 1].status;
  }
}
