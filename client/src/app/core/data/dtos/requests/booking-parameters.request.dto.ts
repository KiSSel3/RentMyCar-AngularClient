import {BookingStatus} from '../../enums/booking-status.enum';

export interface BookingParametersRequestDTO {
  userId?: string;
  rentOfferId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  status?: BookingStatus;
}
