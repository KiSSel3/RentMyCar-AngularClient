import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandRequestDTO } from '../dtos/brand-request.dto';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/brand`;
  private readonly http = inject(HttpClient);

  createBrand(request: BrandRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, request);
  }

  updateBrand(id: string, request: BrandRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, request);
  }

  deleteBrand(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
