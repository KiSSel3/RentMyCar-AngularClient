import {ReviewDTO} from '../data/dtos/responses/review.dto';
import {Observable} from 'rxjs';
import {PaginatedResult} from '../data/models/pagination.model';
import {ReviewParametersRequestDTO} from '../data/dtos/requests/review-parameters-request.dto';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/cars/api/review`;
  private readonly http = inject(HttpClient);

  getReviews(parameters: ReviewParametersRequestDTO): Observable<PaginatedResult<ReviewDTO>> {
    return this.http.post<PaginatedResult<ReviewDTO>>(`${this.apiUrl}/get-reviews`, parameters);
  }

  getReviewById(id: string): Observable<ReviewDTO> {
    return this.http.get<ReviewDTO>(`${this.apiUrl}/get-by-id/${id}`);
  }
}
