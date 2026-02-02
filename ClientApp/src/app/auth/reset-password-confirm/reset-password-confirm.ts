import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './reset-password-confirm.html',
  styleUrls: ['../auth-layout.css'],
  imports: [RouterModule,FormsModule,CommonModule]
})
export class ResetPasswordConfirm implements OnInit {

  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Invalid or expired reset link';
    }
  }

 submit() {
  this.errorMessage = '';
  this.successMessage = '';

  if (this.newPassword !== this.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  this.isSubmitting = true;

  this.auth.resetPassword(this.token, this.newPassword).subscribe({
    next: () => {
      this.successMessage = 'Password reset successful';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: (err) => {
      this.errorMessage = err?.error || 'Reset link expired or invalid';
      this.isSubmitting = false;
    }
  });
}

}
