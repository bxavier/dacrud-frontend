import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401:
            console.error('Unauthorized access, redirecting to login');
            router.navigate(['/login']);
            errorMessage = 'Your session has expired. Please login again.';
            break;
          case 403:
            errorMessage = "You don't have permission to access this resource";
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          default:
            errorMessage =
              error.status >= 500
                ? 'Server error. Please try again later.'
                : 'An unexpected error occurred. Please try again later.';

            break;
        }

        // Try to extract error message from response if available
        if (error.error && typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.error('HTTP Error:', error);
      }

      notificationService.show(errorMessage, 'error');

      return throwError(() => new Error(errorMessage));
    }),
  );
};
