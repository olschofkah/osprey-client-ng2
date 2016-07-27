

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { OspreyApiService } from './osprey-api.service';
import { Logger } from './logger.service';

@Injectable()
export class AuthService {
    constructor(private log: Logger, private apiService: OspreyApiService, public router: Router) { }

    public isLoggedIn: boolean = false;

    checkAuthState(): Observable<boolean> {
        this.log.info("Checking Auth State ... ");
        this.apiService.isAuthenticated().subscribe(
            data => {
                this.log.info("Authentication State:", data);
                this.isLoggedIn = data;
            },
            err => {
                this.log.error("An error occured fetching the auth status. ", err);
            }
        );
        // TODO double call because i'm too stupid to figure out double subscribes. 
        return this.apiService.isAuthenticated();
    }

    logout() {
        this.isLoggedIn = false;
        this.apiService.logout();
    }
}