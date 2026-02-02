import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../services/group.service';
import { Subject, Subscription } from 'rxjs';
import { GroupStateService } from '../../../services/GroupStateService ';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-info.html',
  styleUrls: ['./group-info.css']
})
export class GroupInfo implements OnInit, OnDestroy {

  groupId!: string;
  members: any[] = [];
  myId = localStorage.getItem('userId');
  showAddMembers = false;
allUsers: any[] = [];
selectedUserIds: string[] = [];
isAdmin = false;




  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router,
    private cdr: ChangeDetectorRef  ,
    private groupState: GroupStateService
  ) {}

  ngOnInit() {
  // 🔹 1. Snapshot (handles refresh)
  const id = this.route.snapshot.paramMap.get('groupId');
  if (id) {
    this.groupId = id;
    this.loadMembers();
  }

  // 🔹 2. Subscribe (handles navigation)
  this.routeSub = this.route.paramMap.subscribe(params => {
    const newId = params.get('groupId');
    if (newId && newId !== this.groupId) {
      this.groupId = newId;
      this.loadMembers();
    }
  });
}

  toggleAddMembers() {
  this.showAddMembers = !this.showAddMembers;

  if (this.showAddMembers) {
    this.loadUsers();
  }
}

loadUsers() {
  this.groupService.getAllUsers().subscribe(users => {
    console.log('ALL USERS FROM API:', users);
    console.log('GROUP MEMBERS:', this.members);

    const memberIds = this.members.map(m => m.userId);
    this.allUsers = users.filter(u => !memberIds.includes(u.userId));

    console.log('ADDABLE USERS:', this.allUsers);
  });
}


toggleSelect(userId: string) {
  if (this.selectedUserIds.includes(userId)) {
    this.selectedUserIds =
      this.selectedUserIds.filter(id => id !== userId);
  } else {
    this.selectedUserIds.push(userId);
  }
}

addMembers() {
  this.selectedUserIds.forEach(userId => {
    this.groupService.addMember(this.groupId, userId).subscribe({
      next: () => {
        const user = this.allUsers.find(u => u.userId === userId);
        if (!user) return;

        this.members.push({
          userId: user.userId,
          userName: user.userName,
          role: 0 // Member
        });
      }
    });
  });

  this.selectedUserIds = [];
  this.showAddMembers = false;

  // 👇 ONE change detection only
  this.cdr.detectChanges();
  this.groupState.refreshGroups();
}

loadMembers() {
  console.log('LOADING MEMBERS FOR:', this.groupId);

  this.groupService.getGroupMembers(this.groupId).subscribe({
    next: members => {
      console.log('MEMBERS LOADED:', members);
      this.members = members;

      this.isAdmin = members.some(
        m => m.userId === this.myId && m.role === 1
      );

      this.cdr.detectChanges();
    },
    error: err => console.error('LOAD MEMBERS ERROR:', err)
  });
}

 



  remove(userId: string) {
    this.groupService.removeMember(this.groupId, userId).subscribe(() => {
      this.members = this.members.filter(m => m.userId !== userId);
      this.cdr.detectChanges();
    });
  }

  changeRole(userId: string, role: number) {
  this.groupService.changeRole(this.groupId, userId, role)
    .subscribe(() => {
      const member = this.members.find(m => m.userId === userId);
      if (member) {
        member.role = role;
        this.cdr.detectChanges();
      }
    });
}


  leave() {
    this.groupService.leaveGroup(this.groupId).subscribe(() => {
      this.router.navigate(['/app']);
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
