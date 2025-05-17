import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@features/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],

  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="authService.getCurrentUser() as user" class="user-info">
            <p>
              <strong>Hello, {{ user.email }}!</strong>
            </p>
          </div>
          <p>You are successfully logged in.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="warn" (click)="authService.logout()">Logout</button>
        </mat-card-actions>
      </mat-card>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Notification Tests</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="button-row">
            <button mat-raised-button color="primary" (click)="testInfo()">Test Info</button>
            <button mat-raised-button color="accent" (click)="testSuccess()">Test Success</button>
            <button mat-raised-button color="warn" (click)="testError()">Test Error</button>
            <button mat-raised-button color="warn" (click)="testWarning()">Test Warning</button>
            <button mat-raised-button (click)="testMultiple()">Test Multiple</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .home-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f5;
        gap: 20px;
        padding: 20px;
      }

      mat-card {
        max-width: 600px;
        width: 100%;
        padding: 20px;
      }

      mat-card-title {
        color: #3f51b5;
        margin-bottom: 16px;
      }

      .user-info {
        margin-bottom: 16px;
        padding: 12px;
        background-color: #e3f2fd;
        border-radius: 4px;
      }

      .button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
    `,
  ],
})
export class HomeComponent {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  testInfo() {
    this.notificationService.show('This is an information message', 'info');
  }

  testSuccess() {
    this.notificationService.show('Operation completed successfully!', 'success');
  }

  testError() {
    this.notificationService.show('An error has occurred', 'error');
  }

  testWarning() {
    this.notificationService.show('Warning: This action cannot be undone', 'warning');
  }

  testMultiple() {
    this.notificationService.show('Information notification', 'info');
    setTimeout(() => {
      this.notificationService.show('Success notification', 'success');
    }, 300);
    setTimeout(() => {
      this.notificationService.show('Warning notification', 'warning');
    }, 600);
    setTimeout(() => {
      this.notificationService.show('Error notification', 'error');
    }, 900);
  }
}
