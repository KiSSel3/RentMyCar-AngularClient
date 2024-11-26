import {BookingStatus} from '../../enums/booking-status.enum';

export interface EventDTO {
  status: BookingStatus;
  timestamp: Date;
  message?: string;
}
