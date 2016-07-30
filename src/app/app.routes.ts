import { RouterConfig } from '@angular/router';
import { Home } from './home';
import { HotList } from './hotlist';
import { BlackList } from './blacklist';
import { Login } from './login';

import { _403Error } from './error/fourzerothree'

import { AuthGuard } from './guards/auth-guard'
import { AuthService } from './service/auth.service'

export const routes: RouterConfig = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'hotlist', component: HotList }, // canActivate: [AuthGuard]
  { path: 'blacklist', component: BlackList },
  { path: 'error/403', component: _403Error },
  { path: '**', redirectTo: 'home' }
];

export const AUTH_PROVIDERS = [AuthService]; //AuthGuard
