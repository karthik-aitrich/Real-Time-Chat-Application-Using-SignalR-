import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withRouterConfig } from '@angular/router';
import { authInterceptor } from './interceptors/auth-interceptor';
import { routes } from './app.routes';

export const appConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    )
  ]
};
