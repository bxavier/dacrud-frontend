import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthStateService } from '../services/auth-state.service';

// Simple error message mapping - KISS principle
const ERROR_MESSAGES: Record<number, string> = {
  401: 'Your session has expired. Please login again.',
  403: "You don't have permission to access this resource",
  404: 'Resource not found',
  500: 'Server error. Please try again later.',
};

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authState = inject(AuthStateService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Extract error message - simplified approach
      const errorMessage =
        error.error?.message ||
        ERROR_MESSAGES[error.status] ||
        'An unexpected error occurred. Please try again later.';

      // Handle 401 specifically - clear auth state and redirect
      if (error.status === 401) {
        authState.clearAuthState();
        router.navigate(['/login']);
      }

      notificationService.show(errorMessage, 'error');
      console.error('HTTP Error:', error);

      return throwError(() => new Error(errorMessage));
    }),
  );
};
