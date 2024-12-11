import {environment} from '../../../../environments/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CarModelRequestDTO} from '../dtos/car-model-request.dto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarModelManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/car-model`;
  private readonly http = inject(HttpClient);

  createCarModel(request: CarModelRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, request);
  }

  updateCarModel(id: string, request: CarModelRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, request);
  }

  deleteCarModel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
