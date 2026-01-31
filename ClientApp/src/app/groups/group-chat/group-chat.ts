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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { GroupService } from '../../../services/group.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.html',
  styleUrls: ['../../shared/styles/chat-base.css']
})
export class GroupChat implements OnInit, OnDestroy {

  messages: any[] = [];
  members: any[] = [];

  groupId!: string;
  senderId!: string;
  groupName = 'Group Chat';

  message = '';
  isLoading = false;

  private routeSub!: Subscription;
  private signalRReady = false;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private groupService: GroupService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    this.senderId = localStorage.getItem('userId')!;
    if (!this.senderId) return;

    // 1️⃣ Start SignalR once
    await this.chat.startConnection();
    this.signalRReady = true;

    // 2️⃣ Register group message listener ONCE
    this.chat.onGroupMessageReceived(msg => {
      this.zone.run(() => {
        if (msg.groupId.toString() !== this.groupId) return;

        this.messages = [...this.messages, msg];
        this.cdr.detectChanges();
        this.scrollToBottom();
      });
    });

    // 3️⃣ Handle group route changes
    this.routeSub = this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id || id === 'create') return;

      // Leave old group
      if (this.groupId) {
        await this.chat.leaveGroup(this.groupId);
      }

      this.groupId = id;
      this.groupName = history.state?.groupName ?? 'Group Chat';

      this.messages = [];
      this.members = [];
      this.isLoading = true;

      // Join group
      await this.chat.joinGroup(this.groupId);

      // Load data
      this.loadGroupChat();
      this.loadMembers();
    });
  }

  
  loadGroupChat() {
    if (!this.signalRReady) return;

    this.chat.getGroupHistory(this.groupId).subscribe({
      next: msgs => {
        this.messages = [...msgs].sort(
          (a, b) =>
            new Date(a.sentAt).getTime() -
            new Date(b.sentAt).getTime()
        );

        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }



  loadMembers() {
    this.groupService.getGroupMembers(this.groupId).subscribe({
      next: members => {
        this.members = members;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('LOAD MEMBERS ERROR', err);
      }
    });
  }

  async send() {
    if (!this.message.trim()) return;
    if (!this.signalRReady) return;

    const text = this.message;
    this.message = '';
    this.cdr.detectChanges();

    await this.chat.sendGroupMessage(this.groupId, text);
  }





  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTo({
          top: this.chatBody.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  openGroupInfo() {
    this.router.navigate(['/app/group-info', this.groupId]);
  }

  get membersCount(): number {
    return this.members.length;
  }

  
  ngOnDestroy() {
    this.routeSub?.unsubscribe();

    if (this.groupId) {
      this.chat.leaveGroup(this.groupId);
    }
  }
}
