import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
   styleUrls: [
    './chat-window.css',
    '../../shared/styles/chat-base.css'
  ]
})
export class ChatWindow implements OnInit, AfterViewChecked {

  messages: any[] = [];
  senderId!: string;
  receiverId!: string;
selectedName = '';

  message = '';
  isLoading = false;

  private shouldScroll = false;   // 🔑 scroll control

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService
  ) {}

  ngOnInit() {
    const sender = localStorage.getItem('userId');
    if (!sender) return;
    this.senderId = sender;

    // 🔥 INSTANT chat load on click (NO double click)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.receiverId = id;
      this.isLoading = true;
const nav = history.state;
  this.selectedName = nav.userName || 'Chat';

      this.loadChat(); // 👈 load immediately
    });

    // 🔥 realtime private messages
    this.chat.onMessageReceived(msg => {
      if (
        (msg.senderId === this.receiverId && msg.receiverId === this.senderId) ||
        (msg.senderId === this.senderId && msg.receiverId === this.receiverId)
      ) {
        this.messages.push(msg);
        this.shouldScroll = true;
      }
    });
  }

  loadChat() {
    this.chat.getHistory(this.senderId, this.receiverId).subscribe({
      next: m => {
        // WhatsApp behavior: sorted history
        this.messages = m.sort(
          (a, b) =>
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

        this.isLoading = false;
        this.shouldScroll = true; // scroll AFTER render
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // 🔥 scroll ONLY after DOM finished rendering
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  send() {
    if (!this.message.trim()) return;

    const newMsg = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      messageText: this.message,
      sentAt: new Date(),
      status: 0
    };

    this.messages.push(newMsg);
    this.shouldScroll = true;

    this.chat.sendMessage(this.senderId, this.receiverId, this.message);
    this.message = '';
  }

  scrollToBottom() {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }
}
