import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private auth: AuthService) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.auth.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => alert('Password updated'),
      error: () => alert('Invalid current password')
    });
  }
}

