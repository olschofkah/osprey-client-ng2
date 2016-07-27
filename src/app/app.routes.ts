import { RouterConfig } from '@angular/router';
import { Home } from './home';
import { HotList } from './hotlist'
import { _403Error } from './error/_403'

export const routes: RouterConfig = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'hotlist', component: HotList },
  { path: 'error/403', component: _403Error },
  { path: '**', redirectTo: 'home' }
];
