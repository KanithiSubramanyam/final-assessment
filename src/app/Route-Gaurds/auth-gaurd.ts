import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { RolesService } from '../Services/Roles.service';
import { UserService } from '../Services/userService.service';

export const canActivate = (
  router: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const route = inject(Router);
  const userService = inject(UserService);

  return authService.user.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        return of(route.createUrlTree(['/login']));
      }

      console.log('User:', user);
      const requiredRoles = router.data['roles'] as Array<string> || [];

      if (requiredRoles.length > 0) {
        return userService.getCurrentUser().pipe(
          map(userData => {
            const userRole = userData.role;
            return requiredRoles.includes(userRole)
              ? true
              : route.createUrlTree(['/not-authorized']);
          })
        );
      }
      // If no roles are required for this route, allow access
      return of(true);
    })
  );
};
