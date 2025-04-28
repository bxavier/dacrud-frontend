import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

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
    </div>
  `,
  styles: [
    `
      .home-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
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
    `,
  ],
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
