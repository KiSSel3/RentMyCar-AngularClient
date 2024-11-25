import {environment} from '../../../environments/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CarParametersRequestDTO} from '../data/dtos/requests/car-parameters-request.dto';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../data/models/pagination.model';
import {CarDTO} from '../data/dtos/responses/car.dto';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/car`;
  private readonly http = inject(HttpClient);

  getCarsByParameters(parameters: CarParametersRequestDTO): Observable<PaginatedResult<CarDTO>> {
    return this.http.post<PaginatedResult<CarDTO>>(`${this.apiUrl}/get-by-parameters`, parameters);
  }

  getCarById(id: string): Observable<CarDTO> {
    return this.http.get<CarDTO>(`${this.apiUrl}/get-by-id/${id}`);
  }
}
