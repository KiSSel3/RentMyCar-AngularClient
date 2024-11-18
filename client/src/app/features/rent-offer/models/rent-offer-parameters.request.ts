export interface RentOfferParametersRequest {
  carId?: string;
  city?: string;
  street?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: Date;
  availableTo?: Date;
  pageNumber?: number;
  pageSize?: number;
}
