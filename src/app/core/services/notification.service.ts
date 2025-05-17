import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  createdAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  getNotifications() {
    return this.notifications;
  }

  show(message: string, type: NotificationType = 'info'): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      createdAt: Date.now(),
    };

    this.notifications.update(current => [...current, notification]);

    // Auto-dismiss non-error notifications after 5 seconds
    setTimeout(() => {
      this.remove(notification.id);
    }, 5000);
  }

  remove(id: string): void {
    this.notifications.update(notifications =>
      notifications.filter(notification => notification.id !== id),
    );
  }

  clear(): void {
    this.notifications.set([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
