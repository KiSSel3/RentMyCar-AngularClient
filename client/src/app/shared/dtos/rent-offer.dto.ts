import {LocationModel} from '../models/location.model';

export interface RentOfferDTO {
  id: string;
  userId: string;
  carId: string;
  location: LocationModel;
  availableFrom: Date;
  availableTo: Date;
  createdAt: Date;
  updatedAt: Date;
  pricePerDay: number;
  description: string;
  isAvailable: boolean;
}
