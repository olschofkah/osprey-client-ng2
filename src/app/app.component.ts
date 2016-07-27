import { Component, Directive, ElementRef, Renderer } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';
import { Logger } from './service/logger.service';
import { Config } from './service/config.service';
import { AuthService } from './service/auth.service'
import { OspreyApiService } from './service/osprey-api.service'

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
  providers: [Logger, Config, AuthService, OspreyApiService]
})
export class App {

  constructor(public http: Http, private log: Logger, private _config: Config, public authService: AuthService) { }

  ngOnInit() {
    this.log.info("ng init ... ");
  }

  logout(){
    this.authService.logout();
  }

}
