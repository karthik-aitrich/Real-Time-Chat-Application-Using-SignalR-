import { Routes } from '@angular/router';
import { UsersResolver } from './resolvers/users.resolver';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ChatWindow } from './chat/chat-window/chat-window';
import { GroupChat } from './groups/group-chat/group-chat';
import { GroupInfo } from './groups/group-info/group-info';
import { Settings } from './settings/settings/settings';
import { Empty } from './empty/empty/empty';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // App shell
  {
    path: 'app',
    component: MainLayout,
    resolve: {
    users: UsersResolver
  },
    children: [

      { path: '', component: Empty },

      { path: 'chat/:id', component: ChatWindow },
      { path: 'group/:id', component: GroupChat },
      { path: 'group-info/:id', component: GroupInfo },

      {
        path: 'settings',
        component: Settings,
        children: [
          {
            path: 'change-password',
            loadComponent: () =>
              import('./settings/change-password/change-password')
                .then(m => m.ChangePassword)
          }
        ]
      }
    ]
  }
];
