import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const require: any;
const ngVersion = require('../package.json').dependencies['@angular/core'];

if (environment.production) {
  enableProdMode();
}

const platform =
  ((window as any).angularPlatform
    ? (window as any).angularPlatform[ngVersion]
    : platformBrowserDynamic()) || platformBrowserDynamic();

platform
  .bootstrapModule(AppModule, { ngZone: (window as any).ngZone })
  .catch((err: any) => console.error(err));
