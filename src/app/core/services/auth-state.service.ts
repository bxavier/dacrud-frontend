import { Injectable, signal } from '@angular/core';
import { IAuthStateService } from '../abstractions/auth.interface';
import { User } from '@features/auth/models/auth.models';
import { TokenStorageService, UserStorageService } from './storage.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService implements IAuthStateService {
  private authState = signal<boolean>(false);
  private currentUser = signal<User | null>(null);

  constructor(
    private tokenStorage: TokenStorageService,
    private userStorage: UserStorageService,
    private tokenService: TokenService,
  ) {
    this.initializeAuthState();
  }

  isAuthenticated(): boolean {
    return this.authState();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  setAuthenticatedUser(user: User): void {
    this.currentUser.set(user);
    this.authState.set(true);
    this.userStorage.setUser(user);
  }

  clearAuthState(): void {
    this.authState.set(false);
    this.currentUser.set(null);
    this.tokenStorage.removeToken();
    this.userStorage.removeUser();
  }

  private initializeAuthState(): void {
    const token = this.tokenStorage.getToken();
    const user = this.userStorage.getUser<User>();

    if (!token) {
      this.clearAuthState();
      return;
    }

    if (this.tokenService.isTokenExpired(token)) {
      this.clearAuthState();
      return;
    }

    this.authState.set(true);
    this.currentUser.set(user);
  }
}
