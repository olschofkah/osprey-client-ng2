// the polyfills must be the first thing imported in node.js
// import 'angular2-universal/polyfills'; // polyfills are moved to server.ts

// TODO DELETE ME

// Angular 2 Universal
import {
  REQUEST_URL,
  ORIGIN_URL,
  NODE_LOCATION_PROVIDERS,
  NODE_HTTP_PROVIDERS,
  ExpressEngineConfig
} from 'angular2-universal';

import { provideRouter } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Request, Response} from 'express';

// Application
import {App} from './app/app.component';
import {routes} from './app/app.routes';

export function ngApp(req:Request, res:Response) {
  let baseUrl = '/';
  let url = req.originalUrl || '/';

  let config: ExpressEngineConfig = {
    directives: [
      App
    ],
    platformProviders: [
      {provide: ORIGIN_URL, useValue: 'http://localhost:3000'}, // TODO FIX
      {provide: APP_BASE_HREF, useValue: baseUrl},
    ],
    providers: [
      {provide: REQUEST_URL, useValue: url},
      NODE_HTTP_PROVIDERS,
      provideRouter(routes),
      NODE_LOCATION_PROVIDERS
    ],
    async: true,
    preboot: false, // { appRoot: 'app' } // your top level app component selector
  };

  res.render('index', config);
}
