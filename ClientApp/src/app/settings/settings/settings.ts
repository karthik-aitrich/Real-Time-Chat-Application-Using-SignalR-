import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html'
})
export class Settings implements OnInit {

  userName = '';
  email = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || 'User';
    this.email = localStorage.getItem('email') || '';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
