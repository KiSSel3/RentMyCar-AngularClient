import {PaginationRequestDTO} from './pagination.request.dto';

export interface UserRentOffersRequestDTO extends PaginationRequestDTO {
  isAvailable?: boolean;
}
