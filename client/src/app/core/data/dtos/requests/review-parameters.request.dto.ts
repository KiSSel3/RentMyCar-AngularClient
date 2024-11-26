import {PaginationRequestDTO} from './pagination.request.dto';

export interface ReviewParametersRequestDTO extends PaginationRequestDTO {
  reviewerId?: string;
  rentOfferId?: string;
  minDate?: Date;
  maxDate?: Date;
  minRating?: number;
}
