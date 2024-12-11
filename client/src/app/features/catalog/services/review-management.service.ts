import {environment} from '../../../../environments/environment';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateReviewRequestDTO} from '../models/create-review.request.dto';
import {ReviewRequestDTO} from '../models/review.request.dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewManagementService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/review`;
  private readonly http = inject(HttpClient);

  createReview(request: CreateReviewRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, request);
  }

  updateReview(id: string, request: ReviewRequestDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
