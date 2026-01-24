import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './settings.html',
  styleUrls: ['../../shared/styles/chat-base.css','./settings.css'],
  imports: [CommonModule,FormsModule,RouterLink,RouterModule]

})
export class Settings {

  userName = localStorage.getItem('userName');
  email = localStorage.getItem('email');

  isChangePasswordOpen = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChangePasswordOpen =
          event.url.includes('change-password');
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

  // goToChangePassword() {
  //   this.router.navigate(['/app/change-password']);
  // }

//   logout() {
//     this.auth.logout().subscribe(() => {
//       localStorage.clear();
//       this.router.navigate(['/login']);
//     });
//   }
// }