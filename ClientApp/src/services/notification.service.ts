import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatStateService } from './chat-state.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private chatService: ChatService,
    private chatState: ChatStateService
  ) {
    this.listen();
  }

 private listen() {
  this.chatService.incomingMessage$.subscribe(msg => {

    const currentUserId = localStorage.getItem('userId');

    // 🔥 RULE 1: notify ONLY the receiver
    if (msg.receiverId !== currentUserId) {
      return;
    }

    // 🔥 RULE 2: do NOT notify if chat with sender is open
    if (this.chatState.activeChatUserId === msg.senderId) {
      return;
    }

    // ✅ Now it's a REAL incoming notification
    this.showNotification(msg);
    this.playSound();
    this.incrementUnread(msg.senderId);
  });
}


  private showNotification(msg: any) {
    // simple version
    alert(`New message from ${msg.senderName || 'User'}`);
  }

  private playSound() {
    const audio = new Audio('/assets/notify.mp3');
    audio.play().catch(() => {});
  }

  private incrementUnread(senderId: string) {
    // update badge count (chat list)
  }
}
