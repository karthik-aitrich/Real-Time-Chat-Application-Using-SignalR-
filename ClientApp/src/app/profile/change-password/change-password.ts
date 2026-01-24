import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css'],
  imports: [FormsModule, CommonModule]
})
export class ChangePassword {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  changePassword() {
    // reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // 1️⃣ confirm mismatch
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    // 2️⃣ basic strength check
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    // 3️⃣ new password should differ
    if (this.currentPassword === this.newPassword) {
      this.errorMessage = 'New password must be different from current password.';
      return;
    }

    this.isSubmitting = true;

    this.auth.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.successMessage = res?.message || 'Password changed successfully.';

        // redirect back to profile after short delay
        setTimeout(() => {
          this.router.navigate(['/app/settings']);
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err?.error) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Failed to change password.';
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/settings']);
  }

  goToForgot() {
    // later route → forgot-password page
    alert('Forgot password flow later');
  }
}
