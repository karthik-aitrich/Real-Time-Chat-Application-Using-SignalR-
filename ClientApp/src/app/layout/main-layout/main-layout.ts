import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../shared/notification/notification';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
  imports: [CommonModule, RouterModule,Sidebar,Notification] 
})
export class MainLayout implements OnInit {

  
  constructor(
    private chat: ChatService,
    private notificationService: NotificationService // 🔥 IMPORTANT
  ) {}

  async ngOnInit() {
   await this.chat.startConnection();

    // 🔥 activates ReceiveMessage → incomingMessage$
    // this.chat.onMessageReceived();

    // 🔥 ask browser permission once
   if ('Notification' in window) {
  if (window.Notification.permission === 'default') {
    window.Notification.requestPermission();
  }
}
    

    console.log('SignalR + notifications ready');
  }
  

  
}
