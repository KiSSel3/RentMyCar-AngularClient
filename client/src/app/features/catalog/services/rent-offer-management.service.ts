import {environment} from '../../../../environments/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RentOfferManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/rent-offer`;
  private readonly http = inject(HttpClient);

  deleteRentOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
