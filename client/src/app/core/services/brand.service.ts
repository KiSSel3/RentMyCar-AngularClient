import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {BrandDTO} from '../data/dtos/responses/brand.dto';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/brand`;
  private readonly http = inject(HttpClient);

  getAllBrands(): Observable<BrandDTO[]> {
    return this.http.get<BrandDTO[]>(`${this.apiUrl}/get-all`);
  }

  getBrandById(id: string): Observable<BrandDTO> {
    return this.http.get<BrandDTO>(`${this.apiUrl}/get-by-id/${id}`);
  }

  getBrandByName(name: string): Observable<BrandDTO> {
    return this.http.get<BrandDTO>(`${this.apiUrl}/get-by-name/${name}`);
  }
}
