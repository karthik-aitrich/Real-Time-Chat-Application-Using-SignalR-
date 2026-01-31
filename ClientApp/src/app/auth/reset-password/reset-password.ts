import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['../auth-layout.css','./reset-password.css'],
})
export class ResetPassword {

  email = '';
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'Email is required';
      return;
    }

    this.isSubmitting = true;

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage =
          'If this email exists, a reset link has been sent.';
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Try again.';
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
