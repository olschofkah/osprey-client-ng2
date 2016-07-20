import { RouterConfig } from '@angular/router';
import { Home } from './home';
import { HotList } from './hotlist'

export const routes: RouterConfig = [
  { path: '', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'hotlist', component: HotList },
  { path: '**', redirectTo: 'home' }
];
