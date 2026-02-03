import { Component, OnInit } from '@angular/core';
import { AppNotification, NotificationStateService } from '../../../services/notification-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
  ,imports: [FormsModule,CommonModule]
})
export class Notification implements OnInit {

  

   notifications$!: Observable<AppNotification[]>;

  constructor(
    private notificationState: NotificationStateService
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationState.notifications;
  }
}
