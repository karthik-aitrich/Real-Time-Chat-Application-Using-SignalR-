import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';
import { ChatStateService } from '../../../services/chat-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
  styleUrls: [
    './chat-window.css',
    '../../shared/styles/chat-base.css'
  ]
})
export class ChatWindow implements OnInit, OnDestroy {

  messages: any[] = [];
  senderId!: string;
  receiverId!: string;
  private msgSub!: Subscription;

  private incomingSub!: Subscription;

  selectedName = '';
  message = '';

  isOnline = false;
  isTyping = false;
  isLoading = false;
  

  private routeSub!: Subscription;
  private signalRReady = false;
  private typingTimeout: any;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
     private chatState: ChatStateService
  ) {}

  // ===============================
  // INIT
  // ===============================
  async ngOnInit() {
    this.senderId = String(localStorage.getItem('userId'));
    if (!this.senderId) return;

    await this.chat.startConnection();
    this.signalRReady = true;

    this.registerSignalREvents();

    this.routeSub = this.route.paramMap.subscribe(params => {
  const id = params.get('id');
  if (!id) return;

  this.receiverId = String(id);

  // 🔥 THIS LINE
  this.chatState.activeChatUserId = this.receiverId;

  this.messages = [];
  this.isLoading = true;

  this.setSelectedName();
  this.registerPresenceListeners();
  this.loadChat();
});

  }

  // ===============================
  // SIGNALR EVENTS
  // ===============================
private registerSignalREvents() {

  // ===============================
  // MESSAGE STATUS (Sent → Delivered → Read)
  // ===============================
  this.chat.onMessageStatusUpdated(data => {
    const msg = this.messages.find(m => m.messageId === data.messageId);
    if (msg) {
      msg.status = data.status;
      this.cdr.detectChanges();
    }
  });

  // ===============================
  // RECEIVE MESSAGE (SINGLE subscription)
  // ===============================
  this.msgSub = this.chat.incomingMessage$.subscribe(msg => {
    this.zone.run(() => {

      msg.senderId = String(msg.senderId);
      msg.receiverId = String(msg.receiverId);

      const isForCurrentChat =
        (msg.senderId === this.receiverId && msg.receiverId === this.senderId) ||
        (msg.senderId === this.senderId && msg.receiverId === this.receiverId);

      if (!isForCurrentChat) return;

      const index = this.messages.findIndex(m =>
        // replace optimistic message
        (m.clientTempId &&
          m.senderId === msg.senderId &&
          m.messageText === msg.messageText) ||
        // normal server update
        (m.messageId && m.messageId === msg.messageId)
      );

      if (index !== -1) {
        this.messages[index] = msg;
      } else {
        this.messages.push(msg);
      }

      this.cdr.detectChanges();
      this.scrollToBottom();

      if (msg.receiverId === this.senderId) {
        this.chat.markMessageSeen(msg.messageId, msg.senderId);
      }
    });
  });

  // ===============================
  // MESSAGE READ
  // ===============================
  this.chat.onMessageSeen(data => {
    const msg = this.messages.find(m => m.messageId === data.messageId);
    if (msg) {
      msg.status = 'Read';
      this.cdr.detectChanges();
    }
  });

  // ===============================
  // TYPING INDICATOR (THIS IS ALL YOU NEED)
  // ===============================
  this.chat.onUserTyping((senderId: string) => {
    if (senderId === this.receiverId) {
      this.isTyping = true;
      this.cdr.detectChanges();
    }
  });

  this.chat.onUserStoppedTyping((senderId: string) => {
    if (senderId === this.receiverId) {
      this.isTyping = false;
      this.cdr.detectChanges();
    }
  });
}



    // Receive message
//     this.chat.onMessageReceived(msg => {
//       this.zone.run(() => {

//         msg.senderId = String(msg.senderId);
//         msg.receiverId = String(msg.receiverId);

//         const isForCurrentChat =
//           (msg.senderId === this.receiverId && msg.receiverId === this.senderId) ||
//           (msg.senderId === this.senderId && msg.receiverId === this.receiverId);

//         if (!isForCurrentChat) return;

//         const index = this.messages.findIndex(
//   m =>
//     m.status === 'Sent' &&
//     m.senderId === msg.senderId &&
//     m.receiverId === msg.receiverId &&
//     m.messageText === msg.messageText
// );


//         if (index !== -1) {
//           this.messages[index] = { ...msg };
//         } else {
//           this.messages.push(msg);
//         }

//         this.cdr.detectChanges();
//         this.scrollToBottom();

//         // Notify read ONLY if I am receiver
//         if (msg.receiverId === this.senderId) {
//           this.chat.markMessageSeen(msg.messageId, msg.senderId);
//         }
//       });
//     });
  

  // ===============================
  // LOAD CHAT
  // ===============================
  loadChat() {
    if (!this.signalRReady) return;

    this.chat.getHistory(this.senderId, this.receiverId).subscribe({
      next: msgs => {
        this.messages = msgs
          .sort(
            (a, b) =>
              new Date(a.sentAt).getTime() -
              new Date(b.sentAt).getTime()
          )
          .map(m => ({
            ...m,
            senderId: String(m.senderId),
            receiverId: String(m.receiverId),
            status:
              m.status === 0 || m.status === 'Sent' ? 'Sent' :
              m.status === 1 || m.status === 'Delivered' ? 'Delivered' :
              m.status === 2 || m.status === 'Read' ? 'Read' :
              'Sent'
          }));

        // Notify backend only (DO NOT update UI)
        this.messages.forEach(msg => {
          if (
            msg.receiverId === this.senderId &&
            msg.status === 'Delivered'
          ) {
            this.chat.markMessageSeen(msg.messageId, msg.senderId);
          }
        });

        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
onTyping() {
  if (!this.receiverId) return;

  this.chat.sendTyping(this.senderId, this.receiverId);

  clearTimeout(this.typingTimeout);
  this.typingTimeout = setTimeout(() => {
    this.chat.stopTyping(this.senderId, this.receiverId);
  }, 800);
}

  // ===============================
  // SEND MESSAGE (OPTIMISTIC)
  // ===============================
  async send() {
  if (!this.message.trim() || !this.signalRReady) return;

  const text = this.message;
  const tempId = crypto.randomUUID();

  const tempMessage = {
    clientTempId: tempId,
    messageId: null,
    senderId: this.senderId,
    receiverId: this.receiverId,
    messageText: text,
    sentAt: new Date(),
    status: 'Sent'
  };

  // ✅ PUSH ONLY ONCE
  this.messages.push(tempMessage);
  this.scrollToBottom();

  this.message = '';
  this.cdr.detectChanges();

  await this.chat.sendMessage(
    this.senderId,
    this.receiverId,
    text
  );
}


  // ===============================
  // PRESENCE + UI
  // ===============================
  private registerPresenceListeners() {
    this.chat.onUserStatusChanged(status => {
      if (status.userId === this.receiverId) {
        this.isOnline = status.isOnline;
        this.cdr.detectChanges();
      }
    });
  }

  private setSelectedName() {
    const users = this.route.snapshot.parent?.data?.['users'];
    const user = users?.find((u: any) => u.userId === this.receiverId);

    this.selectedName = user?.userName ?? 'Chat';
    this.isOnline = !!user?.isOnline;
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.chatBody?.nativeElement?.scrollTo({
        top: this.chatBody.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 0);
  }

  ngOnDestroy() {
  this.routeSub?.unsubscribe();
  this.msgSub?.unsubscribe(); // 🔥 IMPORTANT
  this.chatState.activeChatUserId = null;
}

}
