import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem('token')) {
    inject(Router).navigate(['/']);
    return false;
  } else {
    return true;
  }
};
