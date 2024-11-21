import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {PaginatedResult} from '../../../shared/models/pagination.model';
import {RentOfferDetailDTO} from '../../../shared/dtos/rent-offer-detail.dto';
import {RentOfferParametersRequest} from '../models/rent-offer-parameters.request';
import {RentOfferDTO} from '../../../shared/dtos/rent-offer.dto';
import {UserRentOffersRequest} from '../models/user-rent-offers.request';

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

  getRentOffersByUserId(userId: string, request: UserRentOffersRequest): Observable<PaginatedResult<RentOfferDTO>> {
    return this.http.post<PaginatedResult<RentOfferDTO>>(
      `${this.apiUrl}/get-by-user-id/${userId}`,
      request
    );
  }

  getRentOfferById(id: string): Observable<RentOfferDTO> {
    return this.http.get<RentOfferDTO>(
      `${this.apiUrl}/get-by-id/${id}`
    );
  }

  getRentOfferDetailsById(id: string): Observable<RentOfferDetailDTO> {
    return this.http.get<RentOfferDetailDTO>(
      `${this.apiUrl}/get-details-by-id/${id}`
    );
  }
}
