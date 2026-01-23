import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../app/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  baseUrl = 'http://localhost:5146/api/v1/User/users';

  constructor(private http: HttpClient) {}

  getAllUsers() {
  return this.http.get<User[]>(`${this.baseUrl}`);
}
}
