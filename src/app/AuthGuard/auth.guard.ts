import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../common_service/auth-service.service';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state) => {  

  const authService = inject(AuthServiceService);
  const router = inject(Router);

  const requiredRole = route.data['role'];

  if (authService.isLoggedIn() && (!requiredRole || authService.hasRole(requiredRole))) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
