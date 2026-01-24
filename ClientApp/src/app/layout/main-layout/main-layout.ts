import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
  imports: [CommonModule, RouterModule,Sidebar] 
})
export class MainLayout implements OnInit {

  constructor(private chat: ChatService) {}

  async ngOnInit() {
    await this.chat.startConnection();
    console.log('SignalR started in MainLayout');
  }
}
