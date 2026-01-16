import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./chat.css']
})


export class ChatComponent implements OnInit {

  myName = 'Karthik';
  selectedUser = '';

  users: User[] = [];
messages: Message[] = [];
  senderId!: string ;
  receiverId = '';
  // senderId = localStorage.getItem("userId")!;


  // senderId = '11111111-1111-1111-1111-111111111111';
  // receiverId = '22222222-2222-2222-2222-222222222222';

  message = '';
  // messages: any[] = [];

constructor(
  private chatService: ChatService,
  private userService: UserService,
  private cdr: ChangeDetectorRef
) {}


//   ngOnInit() {

//     if (typeof window !== 'undefined') {
//       this.senderId = localStorage.getItem("userId");
//     }

//     this.chatService.startConnection();

//     this.userService.getUsers().subscribe((res: any[]) => {
//       console.log("Users loaded:", res); 
//   this.users = res.filter(u => u.userId !== this.senderId);
// });


//     this.chatService.onMessageReceived((msg: any) => {
//       this.messages.push(msg);
//     });
//   }

ngOnInit() {
  const id = localStorage.getItem("userId");

  if (!id) {
    console.error("No userId found");
    return;
  }

  this.senderId = id;

  this.chatService.startConnection();

  this.userService.getUsers().subscribe((res: User[]) => {
    console.log("Users loaded:", res);
    this.users = res.filter(u => u.userId !== this.senderId);
    this.cdr.detectChanges();
  });

  this.chatService.onMessageReceived((msg: Message) => {
    this.messages.push(msg);
    this.cdr.detectChanges();
  });
}



  loadHistory() {
    this.chatService
      .getHistory(this.senderId!, this.receiverId)
      .subscribe((res: any[]) => {
        this.messages = res;
      });
  }

  selectUser(user: any) {
    this.selectedUser = user.userName;
    this.receiverId = user.userId;
    this.loadHistory();
  }

  send() {
    if (!this.message.trim()) return;

    this.chatService.sendMessage(
      this.senderId!,
      this.receiverId,
      this.message
    );

    this.messages.push({
      senderId: this.senderId,
      messageText: this.message,
      receiverId: this.receiverId,
      sentAt: new Date().toISOString()
    });

    this.message = '';
  }
}



