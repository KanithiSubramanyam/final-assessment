import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  //to use httpClient need to import provideHttpClient
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()), 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, provideAnimationsAsync()
  ]
};
