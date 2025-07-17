import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiConfig } from '@core/config/api.config';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.models';
import { IAuthService } from '@core/abstractions/auth.interface';
import { AuthStateService } from '@core/services/auth-state.service';
import { TokenStorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);
  private tokenStorage = inject(TokenStorageService);

  login(credentials: LoginCredentials): Observable<User> {
    const loginUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.login}`;

    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      map((response: AuthResponse) => {
        const user: User = { email: credentials.email };
        this.setSession(user, response.token);
        return user;
      }),
    );
  }

  register(credentials: RegisterCredentials): Observable<User> {
    const registerUrl = `${apiConfig.baseUrl}${apiConfig.endpoints.users}`;

    return this.http.post<AuthResponse>(registerUrl, credentials).pipe(
      map((response: AuthResponse) => {
        const user: User = { email: credentials.email };
        this.setSession(user, response.token);
        return user;
      }),
    );
  }

  logout(): void {
    this.authState.clearAuthState();
    this.router.navigate(['/login']);
  }

  // Convenience methods for components that need backward compatibility
  isLoggedIn(): boolean {
    return this.authState.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.authState.getCurrentUser();
  }

  private setSession(user: User, token: string): void {
    this.tokenStorage.setToken(token);
    this.authState.setAuthenticatedUser(user);
  }
}
