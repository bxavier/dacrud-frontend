import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '@core/config/api.config';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticated = signal<boolean>(false);
  private currentUser = signal<User | null>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    // Validate token on app initialization
    this.validateAuthState();
  }

  login(credentials: LoginCredentials): Observable<User> {
    const loginUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.login}`;

    return new Observable<User>(observer => {
      this.http.post<AuthResponse>(loginUrl, credentials).subscribe({
        next: (response: AuthResponse) => {
          const user: User = {
            email: credentials.email,
          };
          this.setSession(user, response.token);
          observer.next(user);
          observer.complete();
        },
        error: error => {
          // Error handling is now managed by the interceptor
          observer.error(error);
        },
      });
    });
  }

  register(credentials: RegisterCredentials): Observable<User> {
    const registerUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.users}`;

    return new Observable<User>(observer => {
      this.http.post<AuthResponse>(registerUrl, credentials).subscribe({
        next: (response: AuthResponse) => {
          const user: User = {
            email: credentials.email,
          };
          this.setSession(user, response.token);
          observer.next(user);
          observer.complete();
        },
        error: error => {
          observer.error(error);
        },
      });
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('current_user');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
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

  private validateAuthState(): void {
    const user = this.getUserFromStorage();
    this.currentUser.set(user);

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.isAuthenticated.set(false);
      return;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        this.isAuthenticated.set(false);
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      const expiry = payload.exp;
      if (!expiry) {
        // If no expiry in token, we could validate on server
        // For now, just assume it's valid if it exists
        this.isAuthenticated.set(true);
        return;
      }

      // Check if current time is past expiry (exp is in seconds since epoch)
      const now = Math.floor(Date.now() / 1000);
      this.isAuthenticated.set(now < expiry);

      if (!this.isAuthenticated()) {
        this.logout();
      }
    } catch (error) {
      console.error('Error validating token:', error);
      this.isAuthenticated.set(false);
    }
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
