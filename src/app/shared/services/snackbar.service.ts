import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarConfig {
  duration?: number;
  action?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  // Signal to track the current active message
  private activeMessage = signal<string | null>(null);

  // Default durations for different message types
  private readonly DEFAULT_DURATION = 3000;
  private readonly ERROR_DURATION = 5000;

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Shows a snackbar with the specified message
   */
  show(message: string, type: SnackbarType = 'info', config?: SnackbarConfig): void {
    this.activeMessage.set(message);

    const duration =
      config?.duration || (type === 'error' ? this.ERROR_DURATION : this.DEFAULT_DURATION);

    // Set appropriate CSS class based on the message type
    const panelClass = `snackbar-${type}`;

    this.snackBar
      .open(message, config?.action || '', {
        duration,
        panelClass,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      })
      .afterDismissed()
      .subscribe(() => {
        this.activeMessage.set(null);
      });
  }

  /**
   * Shows a success message
   */
  success(message: string, config?: SnackbarConfig): void {
    this.show(message, 'success', config);
  }

  /**
   * Shows an error message
   */
  error(message: string, config?: SnackbarConfig): void {
    this.show(message, 'error', config);
  }

  /**
   * Shows a warning message
   */
  warning(message: string, config?: SnackbarConfig): void {
    this.show(message, 'warning', config);
  }

  /**
   * Shows an info message
   */
  info(message: string, config?: SnackbarConfig): void {
    this.show(message, 'info', config);
  }

  /**
   * Gets the currently active message
   */
  getMessage() {
    return this.activeMessage();
  }
}
