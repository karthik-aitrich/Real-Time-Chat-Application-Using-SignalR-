import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  standalone: true,
  templateUrl: './verify-otp.html',
  styleUrls: ['../auth-layout.css','./verify-otp.css'],
  imports: [CommonModule, FormsModule]
})
export class VerifyOtp {

  otp = '';
  email = '';
  errorMessage = '';
  resendDisabled = true;
resendTimer = 300; // 5 minutes (seconds)
private timerInterval: any;


  private userName = '';
  private password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
    
    
  ) 
  {
    const data = this.authService.getPendingRegister();

    // ❌ If user refreshes or comes directly
    if (!data) {
      this.router.navigate(['/register']);
      return;
    }

    this.userName = data.userName;
    this.email = data.email;
    this.password = data.password;
    this.startResendTimer();

  }



startResendTimer() {
  this.resendDisabled = true;
  this.resendTimer = 300;

  if (this.timerInterval) {
    clearInterval(this.timerInterval);
  }

  this.timerInterval = setInterval(() => {
   if (this.resendTimer === 0) {
  this.resendDisabled = false;
  clearInterval(this.timerInterval);
  this.cdr.detectChanges();
  return;
}

this.resendTimer--;
this.cdr.detectChanges();

  }, 1000);
}





resendOtp() {
  if (this.resendDisabled) return; // guard

  this.authService.resendOtp(this.email).subscribe({
    next: () => {
      this.startResendTimer(); // disables + restarts timer
    },
    error: () => {
      this.errorMessage = 'Failed to resend OTP. Try again.';
      this.resendDisabled = false;
    }
  });
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


goBack() {
  this.router.navigate(['/register']);
}


}
