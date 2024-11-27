import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateBookingRequestDTO} from '../models/create-booking.request.dto';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RentOfferBookingService {
  private readonly apiUrl = `${environment.apiUrl}/booking/api/bookings`;
  private readonly http = inject(HttpClient);

  createBooking(dto: CreateBookingRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, dto);
  }
}
