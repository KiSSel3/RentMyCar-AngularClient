import {EventDTO} from './event.dto';

export interface BookingDTO {
  id: string;
  userId: string;
  rentOfferId: string;
  rentalStart: Date;
  rentalEnd: Date;
  totalPrice: number;
  events: EventDTO[];
}
