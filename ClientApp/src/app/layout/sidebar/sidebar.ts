import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sidebar.css'],
  templateUrl: './sidebar.html'
})
export class Sidebar implements OnInit {

  users: any[] = [];
  groups: any[] = [];
  activeTab: 'chats' | 'groups' = 'chats';
  
showSettings = false;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router
  ) {}

ngOnInit(): void {
  console.log('Sidebar INIT');

  const resolvedUsers = this.route.snapshot.data['users'] ?? [];

  const currentUserId = localStorage.getItem('userId');

  this.users = resolvedUsers.filter(
    (u: any) => u.userId !== currentUserId
  );
  console.log(this.route.snapshot.data);


  

  this.groupService.getMyGroups().subscribe(groups => {
    this.groups = groups;
  });
}


toggleSettings() {
  this.showSettings = !this.showSettings;
}

goToProfile() {
  this.showSettings = false;
  this.router.navigate(['/app/profile']);
}





  openChat(user: any) {
    this.router.navigate(
      ['/app/chat', user.userId],
      { state: { userName: user.userName } }
    );
  }

  openGroup(group: any) {
    this.router.navigate(
      ['/app/group', group.groupId],
      { state: { groupName: group.groupName } }
    );
  }

  createNewGroup() {
    this.router.navigate(['/app/group/create']);
  }

  openSettings() {
    this.router.navigate(['/app/settings']);
  }

  trackUser(_: number, user: any) {
    return user.userId;
  }

  goToChangePassword() {
  this.showSettings = false;
  this.router.navigate(['/app/profile/change-password']);
}
}
