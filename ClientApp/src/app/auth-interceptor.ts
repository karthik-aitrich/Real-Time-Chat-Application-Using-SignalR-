import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // ✅ Public endpoints (NO token)
  const isPublicEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/forgot-password') ||
    req.url.includes('/reset-password');

  // ✅ Attach token ONLY if NOT public
  if (token && !isPublicEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {

      // 🔥 Handle 401 properly
      if (error.status === 401 && !isPublicEndpoint) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};