import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType, HttpParams } from '@angular/common/http';
import { exhaustMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export class AuthInterceptorService implements HttpInterceptor{
    authService: AuthService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler){
        // console.log('Intercepted!', req);
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            // console.log('user', user);
            if(!user){
                return next.handle(req);
            }
            const modifiedReq = req.clone({
                params: new HttpParams().set('auth', user._token
            )})
            // console.log('Modified Request', modifiedReq);
            return next.handle(modifiedReq)
        }));
    }
}