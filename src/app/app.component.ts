import { Component, Directive, ElementRef, Renderer } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';
import { Logger } from './service/logger.service';
import { Config } from './service/config.service';

// templateUrl example
import { Home } from './home';
//
/////////////////////////
// ** Example Directive
// Notice we don't touch the Element directly

@Directive({
  selector: '[x-large]'
})
export class XLarge {
  constructor(element: ElementRef, renderer: Renderer) {
    // ** IMPORTANT **
    // we must interact with the dom through -Renderer-
    // for webworker/server to see the changes
    renderer.setElementStyle(element.nativeElement, 'fontSize', 'x-large');
    // ^^
  }
}

/////////////////////////
// ** MAIN APP COMPONENT **
@Component({
  selector: 'app', // <app></app>
  directives: [
    ...ROUTER_DIRECTIVES,
    XLarge
  ],
  styles: [require('../assets/bootstrap.min.css'), require('../assets/osprey.css')],
  template: require('./app.template.html'),
  providers: [Logger, Config]
})
export class App {

  constructor(public http: Http, private log: Logger, private _config: Config) { }

  ngOnInit() {
    this.log.info("ng init ... ");
    this.log.info("Config Settings | ENV: " + this._config.getEnv() + " Config: " + this._config.getAll());
  }

}
