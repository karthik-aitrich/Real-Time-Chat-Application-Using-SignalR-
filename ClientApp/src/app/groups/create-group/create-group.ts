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
    this.userService.getAllUsers().subscribe(res => {
      // remove yourself from list
      const myId = localStorage.getItem('userId');
      this.users = res.filter(u => u.userId !== myId);
    });
  }

  toggleUser(userId: string, event: any) {
    if (event.target.checked) {
      this.selectedUserIds.push(userId);
    } else {
      this.selectedUserIds =
        this.selectedUserIds.filter(id => id !== userId);
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
