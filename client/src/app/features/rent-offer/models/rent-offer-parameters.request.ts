import {PaginationRequestDTO} from '../../../shared/dtos/pagination-request.dto';

export interface RentOfferParametersRequest extends PaginationRequestDTO {
  carId?: string;
  city?: string;
  street?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: Date;
  availableTo?: Date;
}
