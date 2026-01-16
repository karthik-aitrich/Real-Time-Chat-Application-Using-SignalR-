import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password)
      .subscribe(response => {

        // 🔐 THIS IS THE LINE YOU ASKED ABOUT
        localStorage.setItem("token", response.token);

        // Store user info if needed
        localStorage.setItem("userId", response.userId);

        // Redirect to chat
        this.router.navigate(['/chat']);
      });
  }
}
