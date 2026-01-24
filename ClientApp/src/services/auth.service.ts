import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../app/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private baseUrl = 'http://localhost:5146/api/v1/auth';


 private pendingRegisterData: {
    userName: string;
    email: string;
    password: string;
  } | null = null;


  constructor(private http: HttpClient) {}






login(email: string, password: string) {
  return this.http
    .post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
    .pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('email', res.email);
      })
    );
}


getMe() {
  return this.http.get<any>(`${this.baseUrl}/me`);
}



  register(userName: string, email: string, password: string) {
  return this.http.post(
    'http://localhost:5146/api/v1/Auth/register',
    { userName, email, password }
  );
}

logout() {
  return this.http.post(`${this.baseUrl}/logout`, {});
}


changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  return this.http.post(
    `${this.baseUrl}/change-password`,
    data
  );
}


forgotPassword(email: string) {
  return this.http.post(
    `${this.baseUrl}/forgot-password`,
    { email }
  );
}

resetPassword(token: string, newPassword: string) {
  return this.http.post(
    `${this.baseUrl}/reset-password`,
    { token, newPassword }
  );
}


// 🔹 STORE REGISTER DATA TEMPORARILY
setPendingRegister(data: {
  userName: string;
  email: string;
  password: string;
}) {
  this.pendingRegisterData = data;
}

// 🔹 READ REGISTER DATA
getPendingRegister() {
  return this.pendingRegisterData;
}

// 🔹 CLEAR AFTER OTP SUCCESS
clearPendingRegister() {
  this.pendingRegisterData = null;
}

verifyOtp(data: {
  email: string;
  otp: string;
  userName: string;
  password: string;
}) {
  return this.http.post(
    `${this.baseUrl}/verify-otp`,
    data
  );
}


}
