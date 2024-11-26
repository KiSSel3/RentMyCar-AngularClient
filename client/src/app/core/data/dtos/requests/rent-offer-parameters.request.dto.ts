import {PaginationRequestDTO} from './pagination.request.dto';

export interface RentOfferParametersRequestDTO extends PaginationRequestDTO {
  carId?: string;
  city?: string;
  street?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: Date;
  availableTo?: Date;
}
