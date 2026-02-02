import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GroupStateService } from '../../../services/GroupStateService ';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sidebar.css'],
  templateUrl: './sidebar.html'
})
export class Sidebar implements OnInit, OnDestroy {

  users: any[] = [];
  groups: any[] = [];
  activeTab: 'chats' | 'groups' = 'chats';

  showSettings = false;

  private routerSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router,
    private groupState: GroupStateService
  ) {}

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
  console.log('Sidebar INIT');

  // 1️⃣ Load users from resolver
  const resolvedUsers = this.route.snapshot.data['users'] ?? [];
  const currentUserId = localStorage.getItem('userId');

  this.users = resolvedUsers.filter(
    (u: any) => u.userId !== currentUserId
  );

  // 2️⃣ Initial groups load
  this.loadGroups();

  // 3️⃣ Listen for group refresh events 🔥
  this.groupState.refreshGroups$.subscribe(() => {
    console.log('GROUP REFRESH EVENT RECEIVED');
    this.loadGroups();
  });

  // 4️⃣ Reload groups on navigation
  this.routerSub = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.loadGroups();
    });
}


  // ===============================
  // LOAD GROUPS
  // ===============================
  loadGroups() {
    this.groupService.getMyGroups().subscribe({
      next: groups => {
        this.groups = groups;
      },
      error: err => {
        console.error('LOAD GROUPS ERROR', err);
      }
    });
  }

  // ===============================
  // SETTINGS
  // ===============================
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  goToProfile() {
    this.showSettings = false;
    this.router.navigate(['/app/profile']);
  }

  goToChangePassword() {
    this.showSettings = false;
    this.router.navigate(['/app/profile/change-password']);
  }

  // ===============================
  // NAVIGATION
  // ===============================
  openChat(user: any) {
    this.router.navigate(['/app/chat', user.userId]);
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

  // ===============================
  // TRACKING
  // ===============================
  trackUser(_: number, user: any) {
    return user.userId;
  }

  // ===============================
  // CLEANUP
  // ===============================
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
