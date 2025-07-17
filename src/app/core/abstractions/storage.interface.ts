export interface IStorageService {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}

export interface ITokenStorage {
  setToken(token: string): void;
  getToken(): string | null;
  removeToken(): void;
}

export interface IUserStorage {
  setUser(user: any): void;
  getUser<T>(): T | null;
  removeUser(): void;
}
