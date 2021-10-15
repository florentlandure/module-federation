import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const hostAngularPlatform = (window as any).hostAngularPlatform;

if (environment.production && !hostAngularPlatform) {
  enableProdMode();
}

const platform = hostAngularPlatform || platformBrowserDynamic();

platform
  .bootstrapModule(AppModule, { ngZone: (window as any).ngZone })
  .catch((err: any) => console.error(err));
