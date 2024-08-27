import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, switchMap, take } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { RolesService } from "../Services/Roles.service";
import { CommonDataService } from "../utilites/CommonData.service";

export const canActivate = (
    router: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const route = inject(Router);
    const rolesService = inject(RolesService);
    const commonDataService = inject(CommonDataService);

    return authService.user.pipe(
        take(1),
        switchMap((user) => {
            const loggedIn = user ? true : false;
            if (!loggedIn) {
                return of(route.createUrlTree(['/login']));
            }

            console.log('can activate', user);

            const requiredRoles = router.data['roles'] as Array<string>;

            if (requiredRoles) {
                return commonDataService.getCurrentUserRole().pipe(
                    map(userData => {
                        const userRole = userData.role;

                        if (requiredRoles.includes(userRole)) {
                            return true;
                        }

                        // Redirect to "not-authorized" if the role doesn't match
                        return route.createUrlTree(['/not-authorized']);
                    })
                );
            }

            return of(true);
        })
    );
};
