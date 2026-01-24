import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { User } from '../app/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = 'http://localhost:5146/api/v1/User/users';
  private users$!: Observable<User[]>;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    if (!this.users$) {
      this.users$ = this.http
        .get<User[]>(this.baseUrl)
        .pipe(shareReplay(1)); // 🔥 cache result
    }
    return this.users$;
  }

  clearCache() {
    this.users$ = undefined!;
  }
}
