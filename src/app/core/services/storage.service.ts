import { Injectable } from '@angular/core';
import { IStorageService, ITokenStorage, IUserStorage } from '../abstractions/storage.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService implements IStorageService {
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService implements ITokenStorage {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private storage: StorageService) {}

  setToken(token: string): void {
    this.storage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.storage.removeItem(this.TOKEN_KEY);
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserStorageService implements IUserStorage {
  private readonly USER_KEY = 'current_user';

  constructor(private storage: StorageService) {}

  setUser(user: any): void {
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const userStr = this.storage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as T;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  removeUser(): void {
    this.storage.removeItem(this.USER_KEY);
  }
}
