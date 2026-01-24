import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  templateUrl: './create-group.html',
  imports: [CommonModule,FormsModule],
  styleUrls: ['../../shared/styles/chat-base.css','./create-group.css']
})
export class CreateGroup implements OnInit {

  groupName = '';
  users: any[] = [];
  selectedUserIds: string[] = [];
  error = '';

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
  console.log('CreateGroup INIT');

  this.userService.getAllUsers().subscribe({
    next: (res) => {
      console.log('USERS API RESPONSE:', res);

      const myId = localStorage.getItem('userId');
      this.users = res.filter(u => u.userId !== myId);

      console.log('FILTERED USERS:', this.users);
    },
    error: (err) => {
      console.error('GET USERS ERROR:', err);
      this.error = 'Failed to load users';
    }
  });
}


toggleUser(userId: string, event: any) {
  const exists = this.selectedUserIds.includes(userId);

  if (exists) {
    this.selectedUserIds =
      this.selectedUserIds.filter(id => id !== userId);
  } else {
    this.selectedUserIds.push(userId);
  }
}


  createGroup() {
  const payload = {
    name: this.groupName,
    memberIds: this.selectedUserIds
  };

  console.log('CREATE GROUP PAYLOAD:', payload);

  this.groupService.createGroupWithMembers(
    this.groupName,
    this.selectedUserIds
  ).subscribe({
    next: res => {
      console.log('GROUP CREATED:', res);
      this.router.navigate(['/app/group', res.groupId], {
        state: { groupName: this.groupName }
      });
    },
    error: err => {
      console.error('CREATE GROUP ERROR:', err);
      this.error = err.error?.title ?? 'Failed to create group';
    }
  });
}

}
