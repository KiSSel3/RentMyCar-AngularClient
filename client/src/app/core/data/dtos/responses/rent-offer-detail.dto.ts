import {RentOfferDTO} from './rent-offer.dto';
import {CarDTO} from './car.dto';
import {ImageDTO} from './image.dto';

export interface RentOfferDetailDTO extends RentOfferDTO {
  car: CarDTO;
  images: ImageDTO[];
}
