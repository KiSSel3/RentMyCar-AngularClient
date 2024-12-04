import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
import {CarRequestDTO} from '../dtos/car-request.dto';
@Injectable({
  providedIn: 'root',
})
export class CarManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/car`;
  private readonly http = inject(HttpClient);

  createCar(request: CarRequestDTO): Observable<void> {
    const formData = this.buildFormData(request);
    return this.http.post<void>(`${this.apiUrl}/create`, formData);
  }

  updateCar(id: string, request: CarRequestDTO): Observable<void> {
    const formData = this.buildFormData(request);
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, formData);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  private buildFormData(request: CarRequestDTO): FormData {
    const formData = new FormData();
    formData.append('modelId', request.modelId);
    formData.append('bodyType', request.bodyType);
    formData.append('driveType', request.driveType);
    formData.append('transmissionType', request.transmissionType);
    const modelYear = request.modelYear instanceof Date ? request.modelYear : new Date(request.modelYear);
    formData.append('modelYear', modelYear.toISOString());
    if (request.image) {
      formData.append('image', request.image);
    }
    return formData;
  }
}
