import { Observable } from 'rxjs';
import { User, LoginCredentials, RegisterCredentials } from '@features/auth/models/auth.models';

export interface IAuthService {
  login(credentials: LoginCredentials): Observable<User>;
  register(credentials: RegisterCredentials): Observable<User>;
  logout(): void;
}

export interface IAuthStateService {
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
  setAuthenticatedUser(user: User): void;
  clearAuthState(): void;
}

export interface ITokenService {
  isValidToken(token: string): boolean;
  getTokenExpiration(token: string): number | null;
  isTokenExpired(token: string): boolean;
}
