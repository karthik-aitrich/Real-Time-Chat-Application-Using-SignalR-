import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
  styleUrls: [
    './chat-window.css',
    '../../shared/styles/chat-base.css'
  ]
})
export class ChatWindow
  implements OnInit, AfterViewChecked, OnDestroy {

  messages: any[] = [];

  senderId!: string;
  receiverId!: string;
  selectedName = '';

  message = '';
  isLoading = false;

  private shouldScroll = false;
  private routeSub!: Subscription;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService
  ) {}

  // ===============================
  // INIT
  // ===============================
 async ngOnInit() {
  this.senderId = localStorage.getItem('userId')!;
  if (!this.senderId) return;

  // ✅ ENSURE SIGNALR READY
  await this.chat.startConnection();

  // ✅ REGISTER LISTENER ONCE
  this.chat.onMessageReceived(msg => {
    if (
      (msg.senderId === this.receiverId &&
       msg.receiverId === this.senderId) ||
      (msg.senderId === this.senderId &&
       msg.receiverId === this.receiverId)
    ) {
      this.messages.push(msg);
      this.shouldScroll = true;
    }
  });

  // ✅ ROUTE CHANGE
  this.routeSub = this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (!id) return;

    this.receiverId = id;
    this.isLoading = true;

    const parent = this.route.snapshot.parent;
    const users = parent?.data?.['users'];

    if (Array.isArray(users)) {
      const user = users.find(
        (u: any) => u.userId === this.receiverId
      );
      this.selectedName = user?.userName ?? 'Chat';
    } else {
      this.selectedName = 'Chat';
    }

    this.messages = [];
    this.loadChat();
  });
}

  // ===============================
  // LOAD CHAT HISTORY
  // ===============================
  loadChat() {
    this.isLoading = true;

    this.chat.getHistory(this.senderId, this.receiverId).subscribe({
      next: msgs => {
        this.messages = msgs.sort(
          (a, b) =>
            new Date(a.sentAt).getTime() -
            new Date(b.sentAt).getTime()
        );

        // 🔥 MARK RECEIVED MESSAGES AS SEEN
        this.messages.forEach(msg => {
          if (
            msg.receiverId === this.senderId &&
            msg.status !== 'Seen'
          ) {
            this.chat.markMessageSeen(
              msg.messageId,
              msg.senderId
            );
          }
        });

        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // SEND MESSAGE
  // ===============================
  async send() {
    if (!this.message.trim()) return;
    if (!this.senderId || !this.receiverId) return;
    if (!this.chat.isReady()) return;

    await this.chat.sendMessage(
      this.senderId,
      this.receiverId,
      this.message
    );

    this.message = '';
  }

  // ===============================
  // SCROLL
  // ===============================
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom() {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }

  // ===============================
  // CLEANUP
  // ===============================
  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
