import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['../auth-layout.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})

export class Register {

  userName = '';
  email = '';
  password = '';

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

  if (!this.userName || !this.email || !this.password) {
    this.errorMessage = 'All fields are required';
    return;
  }

  this.errorMessage = '';

  this.authService.register(this.userName, this.email, this.password)
    .subscribe({
      next: () => {

        // ✅ Store data temporarily
        this.authService.setPendingRegister({
          userName: this.userName,
          email: this.email,
          password: this.password
        });

        // ✅ Go to OTP screen
        this.router.navigate(['/verify-otp']);
      },
      error: (err) => {
        this.errorMessage =
          err.status === 400
            ? 'User already exists or invalid data'
            : 'Registration failed. Try again.';
      }
    });
}

}
