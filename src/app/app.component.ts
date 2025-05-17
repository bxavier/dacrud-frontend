import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationStackComponent } from './core/components/notification-stack/notification-stack.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationStackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dacrud-frontend';
}
