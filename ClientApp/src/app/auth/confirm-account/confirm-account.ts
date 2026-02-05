import { Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  templateUrl: './confirm-account.html',
  styleUrls: [
  '../auth-layout.css',
  './confirm-account.css'
]
,
  imports: [CommonModule, FormsModule]
})
export class ConfirmAccount {

  userName = '';
  email = '';
  password = '';
  defaultAvatar = 'assets/user.png';
  previewUrl: string | null = this.defaultAvatar;


  selectedFile: File | null = null;
  // previewUrl: string | null = null;

  loading = false;

constructor(
  private http: HttpClient,
  private router: Router,
  private zone: NgZone
) {
  const nav = this.router.getCurrentNavigation();
  const state = nav?.extras?.state as any;

  if (!state) {
    this.router.navigate(['/register']);
    return;
  }

  this.userName = state.userName;
  this.email = state.email;
  this.password = state.password;
}


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  this.selectedFile = input.files[0];
  this.previewUrl = URL.createObjectURL(this.selectedFile);
}






submit() {
  const formData = new FormData();
  formData.append('UserName', this.userName);
  formData.append('Email', this.email);
  formData.append('Password', this.password);

  // send image only if selected
  if (this.selectedFile) {
    formData.append('ProfilePhoto', this.selectedFile);
  }

  this.loading = true;

  this.http.post<any>(
    'http://localhost:5146/api/v1/auth/confirm',
    formData
  ).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.user.userId);
      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('email', res.user.email);

      this.router.navigate(['/app'], { replaceUrl: true });
    },
    error: () => {
      this.loading = false;
    }
  });
}





  ngOnDestroy() {
  if (this.previewUrl) {
    URL.revokeObjectURL(this.previewUrl);
  }
}


}
