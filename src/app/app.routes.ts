import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './Guards/auth.guard';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./Components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    canActivate: [authGuard],
    component: LoginComponent,
  },
];
