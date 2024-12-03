import {RentOfferRequestDTO} from './rent-offer.request.dto';

export interface CreateRentOfferRequestDTO extends RentOfferRequestDTO {
  userId: string;
}
