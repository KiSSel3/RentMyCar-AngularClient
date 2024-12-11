import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {PaginatedResult} from '../data/models/pagination.model';
import {RentOfferDetailDTO} from '../data/dtos/responses/rent-offer-detail.dto';
import {RentOfferParametersRequestDTO} from '../data/dtos/requests/rent-offer-parameters.request.dto';
import {RentOfferDTO} from '../data/dtos/responses/rent-offer.dto';
import {UserRentOffersRequestDTO} from '../data/dtos/requests/user-rent-offers.request.dto';

@Injectable({
  providedIn: 'root'
})
export class RentOfferService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/rent-offer`;
  private readonly http = inject(HttpClient);

  getRentOffers(parameters: RentOfferParametersRequestDTO): Observable<PaginatedResult<RentOfferDetailDTO>> {
    return this.http.post<PaginatedResult<RentOfferDetailDTO>>(
      `${this.apiUrl}/get-by-parameters`,
      parameters
    );
  }

  getRentOffersByUserId(userId: string, request: UserRentOffersRequestDTO): Observable<PaginatedResult<RentOfferDTO>> {
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
