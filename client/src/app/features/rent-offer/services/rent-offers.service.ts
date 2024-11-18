import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {PaginatedResult} from '../../../shared/models/pagination.model';
import {RentOfferDetailDTO} from '../../../shared/dtos/rent-offer-detail.dto';
import {RentOfferParametersRequest} from '../models/rent-offer-parameters.request';

@Injectable({
  providedIn: 'root'
})
export class RentOffersService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/rent-offer`;
  private readonly http = inject(HttpClient);

  getRentOffers(parameters: RentOfferParametersRequest): Observable<PaginatedResult<RentOfferDetailDTO>> {
    return this.http.post<PaginatedResult<RentOfferDetailDTO>>(
      `${this.apiUrl}/get-by-parameters`,
      parameters
    );
  }
}
