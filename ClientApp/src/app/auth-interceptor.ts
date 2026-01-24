import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // Attach token if exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {

      // 🔥 HANDLE 401 SMARTLY
      if (error.status === 401) {

        // ❌ DO NOT redirect when login API fails
        if (!req.url.includes('/auth/login')) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      }

      // 🔥 VERY IMPORTANT: rethrow error
      return throwError(() => error);
    })
  );
};
