import { Routes } from '@angular/router';
import { LoginComponent } from '@features/auth/components/login/login.component';
import { RegisterComponent } from '@features/auth/components/register/register.component';
import { ForgotPasswordComponent } from '@features/auth/components/forgot-password/forgot-password.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];
