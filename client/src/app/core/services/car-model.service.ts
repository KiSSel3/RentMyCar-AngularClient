import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {CarModelDTO} from '../data/dtos/responses/car-model.dto';
import {CarModelParametersRequestDTO} from '../data/dtos/requests/car-model-parameters.request.dto';


@Injectable({
  providedIn: 'root'
})
export class CarModelService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/car-model`;
  private readonly http = inject(HttpClient);

  getAllCarModels(): Observable<CarModelDTO[]> {
    return this.http.get<CarModelDTO[]>(`${this.apiUrl}/get-all`);
  }

  getCarModelById(id: string): Observable<CarModelDTO> {
    return this.http.get<CarModelDTO>(`${this.apiUrl}/get-by-id/${id}`);
  }

  getCarModelsByName(name: string): Observable<CarModelDTO[]> {
    return this.http.get<CarModelDTO[]>(`${this.apiUrl}/get-by-name/${name}`);
  }

  getCarModelsByBrandId(brandId: string): Observable<CarModelDTO[]> {
    return this.http.get<CarModelDTO[]>(`${this.apiUrl}/get-by-brand-id/${brandId}`);
  }

  getCarModelsByParameters(parameters: CarModelParametersRequestDTO): Observable<CarModelDTO[]> {
    return this.http.post<CarModelDTO[]>(`${this.apiUrl}/get-by-parameters`, parameters);
  }
}
