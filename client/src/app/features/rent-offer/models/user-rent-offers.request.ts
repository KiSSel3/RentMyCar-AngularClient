import {PaginationRequestDTO} from '../../../shared/dtos/pagination-request.dto';

export interface UserRentOffersRequest extends PaginationRequestDTO {
  isAvailable?: boolean;
}
