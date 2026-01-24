import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ChatWindow } from './chat/chat-window/chat-window';
import { GroupChat } from './groups/group-chat/group-chat';
import { GroupInfo } from './groups/group-info/group-info';
import { Settings } from './settings/settings/settings';
import { Empty } from './empty/empty/empty';

export const routes: Routes = [

  // Default → Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Main App (After Login)
  {
    path: 'app',
    component: MainLayout,
    children: [

      // default empty screen
      { path: '', component: Empty },

      // ✅ CREATE GROUP — MUST COME FIRST
      {
        path: 'group/create',
        loadComponent: () =>
          import('./groups/create-group/create-group')
            .then(m => m.CreateGroup)
      },

      // user chat
      { path: 'chat/:id', component: ChatWindow, runGuardsAndResolvers: 'always' },

      // group chat
      { path: 'group/:id', component: GroupChat },

      // group info
      { path: 'group-info/:id', component: GroupInfo },

      // settings
      { path: 'settings', component: Settings },
      
    ]
  }
];
