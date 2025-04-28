import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConfig } from '../config/api.config';

export interface User {
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  timezone?: string;
}

export interface AuthResponse {
  token: string;
}

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

    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      map(response => {
        console.log('Login response:', response);
        const user: User = {
          email: credentials.email,
        };

        this.setSession(user, response.token);
        return user;
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Login failed'));
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
