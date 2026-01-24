import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {

  userName = localStorage.getItem('userName') ?? 'User';
  email = localStorage.getItem('email') ?? '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
