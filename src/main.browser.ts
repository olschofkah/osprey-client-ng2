// Angular 2 Universal
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { provide } from '@angular/core';

// Application
import { App } from './app/app.component';
import { routes, AUTH_PROVIDERS } from './app/app.routes';
import { OspreyApiService } from './app/service/osprey-api.service';
import { Logger } from './app/service/logger.service';
import { Config } from './app/service/config.service';

// you must return bootstrap for client.ts
export function ngApp() {
  return bootstrap(App, [
    ...HTTP_PROVIDERS, 
    AUTH_PROVIDERS,
    provideRouter(routes),
    OspreyApiService,
    Logger,
    Config
  ]);
}
