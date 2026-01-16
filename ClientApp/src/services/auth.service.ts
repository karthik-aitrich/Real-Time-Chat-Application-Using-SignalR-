import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../app/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private baseUrl = 'http://localhost:5146/api/v1/auth';


  constructor(private http: HttpClient) {}

 login(email: string, password: string) {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
    .pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
      })
    );
}

  register(userName: string, email: string, password: string) {
  return this.http.post(
    'http://localhost:5146/api/v1/Auth/register',
    { userName, email, password }
  );
}

}
