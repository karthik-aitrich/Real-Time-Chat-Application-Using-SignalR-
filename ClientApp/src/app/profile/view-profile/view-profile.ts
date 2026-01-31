import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import {  ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-profile.html',
  styleUrls: ['./view-profile.css']
})

export class ViewProfile implements OnInit {
  user: User | null = null;
  initial = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.getMyProfile().subscribe({
      next: user => {
        const hasPhoto =
          user.profilePhoto && user.profilePhoto.trim().length > 0;

        this.user = {
          ...user,
          profilePhoto: hasPhoto
            ? 'http://localhost:5146' + user.profilePhoto
            : null
        };

        this.initial = user.userName.charAt(0).toUpperCase();
         this.cdr.detectChanges();
      },
      error: () => this.logout()
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
