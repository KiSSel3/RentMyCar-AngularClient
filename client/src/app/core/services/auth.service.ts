import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from "ngx-cookie-service";
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {LoginRequest} from '../../features/auth/models/login.request';
import {TokensResponse} from '../../features/auth/models/tokens.response';
import {RegisterRequest} from '../../features/auth/models/register.request';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/identity/api/auth`;
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly jwtHelper = new JwtHelperService();

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_ID_KEY = 'user_id';

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
    return this.http.post<TokensResponse>(
      `${this.apiUrl}/refresh-token`,
      `"${refreshToken}"`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): Observable<void> {
    const userId = this.cookieService.get(this.USER_ID_KEY);
    return this.http.delete<void>(`${this.apiUrl}/logout/${userId}`)
      .pipe(
        tap(() => this.clearAuth())
      );
  }

  getAccessToken(): string {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  getUserId(): string {
    return this.cookieService.get(this.USER_ID_KEY);
  }

  clearAuth(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY);
    this.cookieService.delete(this.REFRESH_TOKEN_KEY);
    this.cookieService.delete(this.USER_ID_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  private handleAuthResponse(response: TokensResponse): void {
    const userId = this.extractUserIdFromToken(response.accessToken);

    this.cookieService.set(this.ACCESS_TOKEN_KEY, response.accessToken);

    this.cookieService.set(this.REFRESH_TOKEN_KEY, response.refreshToken);

    this.cookieService.set(this.USER_ID_KEY, userId);

    this.isAuthenticatedSubject.next(true);
  }

  private extractUserIdFromToken(token: string): string {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  }

  private hasValidToken(): boolean {
    return this.cookieService.check(this.ACCESS_TOKEN_KEY);
  }
}
