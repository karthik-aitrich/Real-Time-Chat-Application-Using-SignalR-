import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,   // 🔥 THIS WAS MISSING
  templateUrl: './login.html',
  styleUrls: ['../auth-layout.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Login {


  email = '';
  password = '';
  errorMessage = ''; // 👈 add this

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

login() {
  this.errorMessage = '';

  // 🔴 1. EMPTY FIELD CHECK
  if (!this.email || !this.password) {
    this.errorMessage = 'Email and password are required';
    return;
  }

  this.authService.login(this.email, this.password)
    .subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/app']);
      },
     error: (err) => {

  if (err.status === 401) {
    this.errorMessage = 'Invalid email or password';
  } else if (err.status === 400) {
    this.errorMessage = 'Invalid login credentials';
  } else {
    this.errorMessage = 'Unable to login. Please try again later';
  }

  // 🔥 FORCE UI REFRESH
  this.cdr.detectChanges();
}

    });
}

}