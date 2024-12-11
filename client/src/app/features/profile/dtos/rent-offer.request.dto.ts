import {LocationModel} from '../../../core/data/models/location.model';

export interface RentOfferRequestDTO {
  carId: string;
  locationModel: LocationModel;
  availableFrom: Date;
  availableTo: Date;
  pricePerDay: number;
  description: string;
}
