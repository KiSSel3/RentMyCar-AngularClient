import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UpdateBookingRequestDTO} from '../dtos/update-booking.request.dto';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingManagementService {
  private readonly apiUrl = `${environment.apiUrl}/booking/api/bookings`;
  private readonly http = inject(HttpClient);

  updateBooking(bookingId: string, request: UpdateBookingRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${bookingId}`, request);
  }
}
