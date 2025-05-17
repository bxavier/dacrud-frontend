import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  private defaultTimeout: number = 5000;

  show(message: string, type: NotificationType, timeout?: number): void {
    const notificationTimeout = timeout ?? this.defaultTimeout;

    this.notifications.update(notifications => [
      ...notifications,
      {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type,
        timeout: notificationTimeout,
      },
    ]);

    if (notificationTimeout > 0) {
      setTimeout(() => {
        this.remove(notifications => notifications[notifications.length - 1].id);
      }, notificationTimeout);
    }
  }

  remove(idOrFn: string | ((notifications: Notification[]) => string)): void {
    this.notifications.update(notifications => {
      const id = typeof idOrFn === 'function' ? idOrFn(notifications) : idOrFn;

      return notifications.filter(notification => notification.id !== id);
    });
  }
}
