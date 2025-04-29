export interface User {
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  timezone?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
}
