# Angular host with module federation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Module federation

Module federation was added by using [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation).


## Bootstrap
During the bootstrap of the app, the host saves the platform on the global scope. It will be reused by the addons.

To allow this, the host needs to always have an updated angular version.

```typescript
const hostAngularPlatform = platformBrowserDynamic();
(window as any).hostAngularPlatform = hostAngularPlatform;

hostAngularPlatform
  .bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));
```

## Router

The host hanlde 2 types of routes:

- Normal routes -> components and modules registered in the host app directly
- Addon routes -> addons loaded at runtime using module federation

### Addon wrapper component

The addon wrapper component handles loading the addons and injecting them in the DOM.

- It first get loads the addon config based on the url parameters.

```typescript
protected async init(url: string): Promise<void> {
    const componentName = url.replace(/.*\/addon\//, '').replace(/\/.*/, '');

    if (componentName) {
      const config = await this.getAddonConfig(componentName);

      if (config) {
        await this.initAddon(config, componentName);
      }
    }
}
```

- Then it loads the javascript for the addon

```typescript
protected loadScript(url: string, componentName: string): Promise<void> {
    const scriptId = componentName + '-script';
    return new Promise((resolve, reject) => {
      if (document.getElementById(scriptId)) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = url;
        script.id = scriptId;
        script.onload = () => {
          resolve();
        };
        document.head.appendChild(script);
      }
    });
}
```

- Then it loads the remote container by using the module federation APIs

```typescript
protected async loadComponent(scope: string, module: string): Promise<any> {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = (window as any)[scope];
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await (window as any)[scope].get(module);
    return factory();
}
```

- Finally it injects the web component in the DOM.

```typescript
protected appendComponentToDom(componentName: string): void {
    // We expect the remote module to register a web component
    const element = document.createElement(componentName);
    this.host.nativeElement.appendChild(element);
}
```
