import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';
import { ChatService } from '../../../services/chat.service';
import { ChangeDetectorRef } from '@angular/core';


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


  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private chat: ChatService,
    private router: Router,
     private cdr: ChangeDetectorRef
  ) {}

 ngOnInit() {
  this.userService.getAllUsers().subscribe(u => {
    console.log('Users loaded:', u);
    this.users = u.filter(x => x.userId !== localStorage.getItem('userId'));

    this.cdr.detectChanges();   // 👈 FORCE UI UPDATE
  });
  

  this.groupService.getMyGroups().subscribe(g => {
  console.log('Groups loaded:', g);   // 👈 ADD THIS
  this.groups = g;
  this.cdr.detectChanges();
  console.log(g);

});




  this.chat.startConnection();
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

//   trackUser(_: number, user: any) {
//   return user.userId;
// }

}

