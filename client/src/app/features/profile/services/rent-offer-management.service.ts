import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CreateRentOfferRequestDTO} from '../dtos/create-rent-offer.request.dto';
import {Observable} from 'rxjs';
import {UpdateRentOfferRequestDTO} from '../dtos/update-rent-offer.request.dto';
import {RemoveImagesRequestDTO} from '../dtos/remove-images.request.dto';

@Injectable({
  providedIn: 'root'
})
export class RentOfferManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/rent-offer`;
  private readonly http = inject(HttpClient);

  createRentOffer(dto: CreateRentOfferRequestDTO): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/create`, dto);
  }

  updateRentOffer(id: string, dto: UpdateRentOfferRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, dto);
  }

  deleteRentOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  addImagesToRentOffer(id: string, formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-images/${id}`, formData);
  }

  removeImagesFromRentOffer(id: string, dto: RemoveImagesRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove-images/${id}`, dto);
  }
}
