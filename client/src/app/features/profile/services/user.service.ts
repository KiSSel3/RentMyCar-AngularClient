import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
import {UserDTO} from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/identity/api/user`;
  private readonly http = inject(HttpClient);

  getUserById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/get-by-id/${userId}`);
  }

  getUserByUsername(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/get-by-username/${username}`);
  }
}
