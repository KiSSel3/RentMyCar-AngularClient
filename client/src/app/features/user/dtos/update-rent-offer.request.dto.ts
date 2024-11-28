import {RentOfferRequestDTO} from './rent-offer.request.dto';

export interface UpdateRentOfferRequestDTO extends RentOfferRequestDTO {
  isAvailable: boolean;
}
