import { Component, Directive, ElementRef, Renderer, OnInit, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Logger } from './service/logger.service';
import { Config } from './service/config.service';
import { AuthService } from './service/auth.service'
import { OspreyApiService } from './service/osprey-api.service'
import { NgIf } from '@angular/common';

// templateUrl example
import { Home } from './home';

/////////////////////////
// ** MAIN APP COMPONENT **
@Component({
  selector: 'app', // <app></app>
  directives: [
    ...ROUTER_DIRECTIVES
  ],
  styles: [require('../assets/bootstrap.min.css'), require('../assets/osprey.css')],
  template: require('./app.template.html'),
  providers: [Logger, Config, AuthService, OspreyApiService, NgIf]
})
export class App implements OnInit, AfterViewInit {

  constructor(public http: Http, private log: Logger, private _config: Config, public authService: AuthService, public router:Router) { }

  ngOnInit() {
    this.log.info("ng init ... ");
  }

  logout() {
    this.router.navigate(['./auth/logout']);
  }

  ngAfterViewInit() {
    this.authService.checkAuthState();
  }

}
