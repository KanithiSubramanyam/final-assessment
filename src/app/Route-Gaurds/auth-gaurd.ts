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
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const route = inject(Router);
  const rolesService = inject(RolesService);
  const userService = inject(UserService);

  return authService.user.pipe(
    take(1),
    switchMap(user => {
      const loggedIn = !!user;
      if (!loggedIn) {
        return of(route.createUrlTree(['/login']));
      }

      const requiredRoles = router.data['roles'] as Array<string>;

      if (requiredRoles) {
        return userService.getCurrentUserData(user.id).pipe(
          map(userData => {
            const userRole = userData.role;
            return requiredRoles.includes(userRole)
              ? true
              : route.createUrlTree(['/not-authorized']);
          })
        );
      }

      return of(true);
    })
  );
};
