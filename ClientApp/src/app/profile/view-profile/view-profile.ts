import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.html',
  styleUrls: ['./view-profile.css']
})
export class ViewProfile {

  userName: string | null = '';
  email: string | null = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userName = localStorage.getItem('userName');
    this.email = localStorage.getItem('email');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        // even if backend fails, force logout
        this.clearSession();
      }
    });
  }

  private clearSession() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
