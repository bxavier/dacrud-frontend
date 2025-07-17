import { Injectable } from '@angular/core';
import { ITokenService } from '../abstractions/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService implements ITokenService {
  isValidToken(token: string): boolean {
    if (!token) return false;

    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }

  getTokenExpiration(token: string): number | null {
    if (!this.isValidToken(token)) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp || null;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;

    const now = Math.floor(Date.now() / 1000);
    return now >= expiration;
  }
}
