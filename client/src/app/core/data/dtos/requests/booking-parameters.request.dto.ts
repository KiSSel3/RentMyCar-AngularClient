import {BookingStatus} from '../../enums/booking-status.enum';

export interface BookingParametersRequestDTO {
  userId?: string;
  rentOfferId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus;
}
