import {PaginationRequestDTO} from './pagination-request.dto';

export interface UserRentOffersRequest extends PaginationRequestDTO {
  isAvailable?: boolean;
}
