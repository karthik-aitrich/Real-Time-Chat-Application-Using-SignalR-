import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';


export const routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'register', component: RegisterComponent }

];
