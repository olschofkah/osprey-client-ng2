\

import { AuthService } from '../service/auth.service';

import { Injectable }  from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }    from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.checkAuthState().subscribe(
            data => {
                console.log("Authentication State:", data);
                return data;
            },
            err => {
               
            }
        );

  }
}