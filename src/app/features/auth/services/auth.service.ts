import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConfig } from '@core/config/api.config';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticated = signal<boolean>(this.hasToken());
  private currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    const loginUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.login}`;

    console.log('Login URL:', loginUrl);
    console.log('Credentials:', credentials);

    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      map(response => {
        console.log('Login response:', response);
        const user: User = {
          email: credentials.email,
        };

        this.setSession(user, response.token);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed';

        if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  register(credentials: RegisterCredentials): Observable<User> {
    const registerUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.users}`;

    return this.http.post<AuthResponse>(registerUrl, credentials).pipe(
      map(response => {
        console.log('Registration response:', response);
        const user: User = {
          email: credentials.email,
        };

        this.setSession(user, response.token);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed';

        if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isLoggedIn$(): Observable<boolean> {
    return of(this.isAuthenticated());
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.isAuthenticated.set(true);
    this.currentUser.set(user);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
