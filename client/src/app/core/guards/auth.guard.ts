import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import {AuthService} from '../services/auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth']);
        return false;
      }
      return true;
    })
  );
};
