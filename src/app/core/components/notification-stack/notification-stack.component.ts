import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService, NotificationType } from '../../services/notification.service';

@Component({
  selector: 'app-notification-stack',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './notification-stack.component.html',
  styleUrls: ['./notification-stack.component.scss'],
})
export class NotificationStackComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.getNotifications();

  close(id: string): void {
    this.notificationService.remove(id);
  }

  getIconForType(type: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
      warning: 'warning',
    };
    return iconMap[type];
  }
}
