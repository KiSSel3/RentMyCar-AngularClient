import {ReviewRequestDTO} from './review.request.dto';

export interface CreateReviewRequestDTO extends ReviewRequestDTO {
  reviewerId: string;
  rentOfferId: string;
}
