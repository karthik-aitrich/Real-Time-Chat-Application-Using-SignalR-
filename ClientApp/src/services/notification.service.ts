import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatStateService } from './chat-state.service';
import { NotificationStateService } from './notification-state.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private chatService: ChatService,
    private chatState: ChatStateService,
    private notificationState: NotificationStateService
  ) {
    this.listen();
  }

  private audio?: HTMLAudioElement;

  private listen() {
    this.chatService.incomingMessage$.subscribe(msg => {

      const currentUserId = localStorage.getItem('userId');

      // 🔥 RULE 1: notify ONLY the receiver
      if (msg.receiverId !== currentUserId) return;

      // 🔥 RULE 2: do NOT notify if chat with sender is open
      if (this.chatState.activeChatUserId === msg.senderId) return;

      // ✅ REAL notification
      this.showNotification(msg);
      this.playSound();
      this.incrementUnread(msg.senderId);
    });
  }

  private showNotification(msg: any) {
    this.notificationState.show(
      msg.senderName || 'New message',
      msg.content || 'You received a new message'
    );
  }

  private playSound() {
  if (!this.audio) {
    this.audio = new Audio('/assets/notify.mp3');
  }

  this.audio.play().catch(() => {});
}

  private incrementUnread(senderId: string) {
    // update badge count later
  }
}
