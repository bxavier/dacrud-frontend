import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import { authGuard } from '@core/guards/auth.guard';
import { AUTH_ROUTES } from '@features/auth/auth.routes';

export const routes: Routes = [
  ...AUTH_ROUTES,
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
