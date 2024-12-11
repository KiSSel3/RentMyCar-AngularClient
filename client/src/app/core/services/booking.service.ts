import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BookingDTO} from '../data/dtos/responses/booking.dto';
import {BookingParametersRequestDTO} from '../data/dtos/requests/booking-parameters.request.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/booking/api/bookings`;
  private readonly http = inject(HttpClient);

  getBookingById(id: string): Observable<BookingDTO> {
    return this.http.get<BookingDTO>(`${this.apiUrl}/get-by-id/${id}`);
  }

  getBookings(parameters: BookingParametersRequestDTO): Observable<BookingDTO[]> {
    return this.http.post<BookingDTO[]>(`${this.apiUrl}/get-by-parameters`, parameters);
  }

  getAvailableDates(rentOfferId: string): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/available-dates/${rentOfferId}`);
  }
}
