import { Routes } from '@angular/router';
import { UsersResolver } from './resolvers/users.resolver';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ChatWindow } from './chat/chat-window/chat-window';
import { GroupChat } from './groups/group-chat/group-chat';
import { GroupInfo } from './groups/group-info/group-info';
import { Empty } from './empty/empty/empty';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // AUTH
  { path: 'login', component: Login },
  { path: 'register', component: Register },
{
  path: 'forgot-password',
  loadComponent: () =>
    import('./auth/reset-password/reset-password')
      .then(m => m.ResetPassword)
},

{
  path: 'reset-password-confirm',
  loadComponent: () =>
    import('./auth/reset-password-confirm/reset-password-confirm')
      .then(m => m.ResetPasswordConfirm)
},


  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./auth/verify-otp/verify-otp')
        .then(m => m.VerifyOtp)
  },
{
  path: 'confirm-profile',
  loadComponent: () =>
    import('./auth/confirm-account/confirm-account')
      .then(m => m.ConfirmAccount)
}
,

  // APP SHELL
 {
  path: 'app',
  component: MainLayout,
  resolve: { users: UsersResolver },
  children: [

    // PROFILE
    {
      path: 'profile',
      loadComponent: () =>
        import('./profile/view-profile/view-profile')
          .then(m => m.ViewProfile)
    },

    {
      path: 'profile/change-password',
      loadComponent: () =>
        import('./profile/change-password/change-password')
          .then(m => m.ChangePassword)
    },

    {
      path: 'group/create',
      loadComponent: () =>
        import('./groups/create-group/create-group')
          .then(m => m.CreateGroup)
    },

    { path: 'chat/:id', component: ChatWindow },
    { path: 'group/:id', component: GroupChat },
    { path: 'group-info/:groupId', component: GroupInfo },


    // EMPTY LAST
    { path: '', component: Empty }
  ]
}

];
