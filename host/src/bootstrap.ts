import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const hostAngularPlatform = platformBrowserDynamic();
(window as any).hostAngularPlatform = hostAngularPlatform;

hostAngularPlatform
  .bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
