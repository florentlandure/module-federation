# Angular addon with module federation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4000/`. The app will automatically reload if you change any of the source files.

## Module federation

Module federation was added by using [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation).

## Bootstrap
Angular doesn't allow to load the platform more than once so the host store the platform on the global scope.

The addon can grab it like this:

```typescript
const hostAngularPlatform = (window as any).hostAngularPlatform;

if (environment.production && !hostAngularPlatform) {
  enableProdMode();
}

const platform = hostAngularPlatform || platformBrowserDynamic();

platform
  .bootstrapModule(AppModule, { ngZone: (window as any).ngZone })
  .catch((err: any) => console.error(err));
```

We only call enableProdMode when the host is not loaded (ie. when serving the addon as a standalone app) because it has already been done by the host.

### Configuration

The addon is registered as a remote container in the `webpack.config.js` file.

```javascript
new ModuleFederationPlugin({
  name: "angularAddon", // The name of the remote container
  filename: "remoteEntry.js", // The name of the file to generate
  exposes: {
    "./web-component": "./src/bootstrap.ts", // What the remote container exposes. Here we expose the bootstrap file because we expose a web component and not an angular module.
  },

  // The libs to share with the host and other remote containers
  shared: {
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/common/http": { singleton: true, strictVersion: true },
    "@angular/router": { singleton: true, strictVersion: true },

    ...sharedMappings.getDescriptors(),
  },
});
```

### Web component

We use `@angular/elements` to register convert our app into a web component.

```typescript
import { createCustomElement } from "@angular/elements";

// ...

export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const element = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define("angular-addon", element);
  }
}
```

### Routing

The base path is set at runtime when the `AppModule` is registered.

```typescript
{
  provide: APP_BASE_HREF,
  useFactory: () => {
    const path =
      location.pathname.substr(1) || location.hash.replace("#/", "");
    return `/${path}`;
  },
}
```

Internal routing can be triggered directly using angular's router.  
External routing (outside of the addon) need to use the SDK's router API.
