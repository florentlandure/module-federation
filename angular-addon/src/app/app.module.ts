import { APP_BASE_HREF } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: () => {
        const path =
          location.pathname.substr(1) || location.hash.replace('#/', '');
        return `/${path}`;
      },
    },
  ],
  bootstrap: [],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const element = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define('angular-addon', element);
  }
}
