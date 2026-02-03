import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  standalone: true,
  templateUrl: './verify-otp.html',
  styleUrls: ['../auth-layout.css'],
  imports: [CommonModule, FormsModule]
})
export class VerifyOtp {

  otp = '';
  email = '';
  errorMessage = '';

  private userName = '';
  private password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const data = this.authService.getPendingRegister();

    // ❌ If user refreshes or comes directly
    if (!data) {
      this.router.navigate(['/register']);
      return;
    }

    this.userName = data.userName;
    this.email = data.email;
    this.password = data.password;
  }

verifyOtp() {
  const formData = new FormData();
  formData.append('Email', this.email);
  formData.append('Otp', this.otp.trim());

  this.authService.verifyOtp(formData).subscribe({
    next: () => {
     this.router.navigate(
  ['/confirm-profile'],
  {
    state: {
      userName: this.userName,
      email: this.email,
      password: this.password
    }
  }
);

    },
    error: () => {
      this.errorMessage = 'Invalid or expired OTP';
    }
  });
}




}
