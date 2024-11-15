import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {LoginRequest} from '../models/login.request';
import {TokensResponse} from '../models/tokens.response';
import {RegisterRequest} from '../models/register.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/identity/api/auth`;
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(request: LoginRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  register(request: RegisterRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  refreshToken(): Observable<TokensResponse> {
    const refreshToken = this.cookieService.get(this.REFRESH_TOKEN_KEY);
    return this.http.post<TokensResponse>(`${this.apiUrl}/refresh-token`, JSON.stringify(refreshToken))
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  getAccessToken(): string {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  private handleAuthResponse(response: TokensResponse): void {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, response.accessToken, {
      secure: true,
      sameSite: 'Strict'
    });
    this.cookieService.set(this.REFRESH_TOKEN_KEY, response.refreshToken, {
      secure: true,
      sameSite: 'Strict'
    });
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuth(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY);
    this.cookieService.delete(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  private hasValidToken(): boolean {
    return this.cookieService.check(this.ACCESS_TOKEN_KEY);
  }
}
