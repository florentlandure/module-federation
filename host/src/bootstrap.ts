import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const require: any;
const ngVersion = require('../package.json').dependencies['@angular/core'];

(window as any).angularPlatform = {
  [ngVersion]: platformBrowserDynamic(),
};

if (environment.production) {
  enableProdMode();
}

(window as any).angularPlatform[ngVersion]
  .bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
