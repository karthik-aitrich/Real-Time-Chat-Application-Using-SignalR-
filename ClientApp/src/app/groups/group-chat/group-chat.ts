import { Component,OnInit,ViewChild,ElementRef,AfterViewChecked} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute ,Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.html',
    styleUrls: [
    
    '../../shared/styles/chat-base.css'
  ]
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
    private chat: ChatService,
    private router: Router, 
  ) {}

async ngOnInit() {
  this.senderId = localStorage.getItem('userId')!;
  if (!this.senderId) return;

  // 🔥 Ensure SignalR connected
  await this.chat.startConnection();

  // 🔥 Listen ONCE
  this.chat.onGroupMessageReceived(msg => {
    if (msg.groupId !== this.groupId) return;

    if (msg.id && this.messageIds.has(msg.id)) return;
    if (msg.id) this.messageIds.add(msg.id);

    this.messages.push(msg);
    this.shouldScroll = true;
  });

  // 🔥 React to route change
  this.route.paramMap.subscribe(async params => {
    const id = params.get('id');
    if (!id || id === 'create') return;

    this.groupId = id;
    this.isLoading = true;

    this.groupName = history.state?.groupName || 'Group Chat';

    await this.chat.joinGroup(this.groupId); // 👈 SAFE NOW
    this.loadGroupChat();
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

 async send() {
  if (!this.message.trim()) return;

  await this.chat.sendGroupMessage(
    this.groupId,
    this.senderId,
    this.message
  );

  this.message = '';
}


  scrollToBottom() {
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }
  }

openGroupInfo() {
  this.router.navigate(['/app/group-info', this.groupId]);
}


get membersCount(): number {
  const uniqueMembers = new Set(
    this.messages
      .filter(m => m.senderId)
      .map(m => m.senderId)
  );

  return uniqueMembers.size;
}



}

