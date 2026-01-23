import { Component,OnInit,ViewChild,ElementRef,AfterViewChecked} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.html',
  styleUrls: ['./group-chat.css']
})
export class GroupChat implements OnInit, AfterViewChecked {

  messages: any[] = [];
  groupId!: string;
  senderId!: string;

  message = '';
  isLoading = false;
  groupName = 'Group Chat';

  private shouldScroll = false;
  private messageIds = new Set<string>();

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService
  ) {}

  ngOnInit() {
    const sender = localStorage.getItem('userId');
    if (!sender) return;
    this.senderId = sender;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // 🔥 critical guard
      if (!id || id === 'create') return;

      this.groupId = id;
      this.isLoading = true;

      const nav = history.state;
      this.groupName = nav.groupName || 'Group Chat';

      this.chat.joinGroup(this.groupId);
      this.loadGroupChat();
    });

    this.chat.onGroupMessageReceived(msg => {
      if (msg.groupId !== this.groupId) return;

      if (msg.id && this.messageIds.has(msg.id)) return;
      if (msg.id) this.messageIds.add(msg.id);

      this.messages.push(msg);
      this.shouldScroll = true;
    });
  }

  loadGroupChat() {
    this.chat.getGroupHistory(this.groupId).subscribe({
      next: m => {
        this.messages = m.sort(
          (a, b) =>
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

        this.messageIds.clear();
        this.messages.forEach(msg => {
          if (msg.id) this.messageIds.add(msg.id);
        });

        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

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
      groupId: this.groupId,
      messageText: this.message,
      sentAt: new Date()
    };

    this.messages.push(newMsg);
    this.shouldScroll = true;

    this.chat.sendGroupMessage(this.groupId, this.senderId, this.message);
    this.message = '';
  }

  scrollToBottom() {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }
}

