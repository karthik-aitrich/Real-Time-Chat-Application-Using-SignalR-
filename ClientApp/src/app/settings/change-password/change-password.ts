import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.auth.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.router.navigate(['/app/settings']);
      },
      error: err => {
        alert(err.error || 'Failed to change password');
      }
    });
  }

  goToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}
