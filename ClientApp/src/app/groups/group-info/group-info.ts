import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../services/group.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-info.html',
  styleUrls: ['./group-info.css']
})
export class GroupInfo implements OnInit {

  groupId!: string;
  members: any[] = [];
  myId = localStorage.getItem('userId');

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.params['id'];

    this.groupService.getGroupMembers(this.groupId)
      .subscribe(m => this.members = m);
  }

  remove(userId: string) {
    this.groupService.removeMember(this.groupId, userId)
      .subscribe(() => {
        this.members = this.members.filter(m => m.userId !== userId);
      });
  }

  changeRole(userId: string, role: number) {
    this.groupService.changeRole(this.groupId, userId, role)
      .subscribe();
  }

  leave() {
    this.groupService.leaveGroup(this.groupId)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
