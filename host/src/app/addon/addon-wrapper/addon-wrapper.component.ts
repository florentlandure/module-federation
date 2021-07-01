import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AddonConfig,
  AddonListConfig,
} from '../../addon-container-config.interface';

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: {
  default: any;
};

@Component({
  selector: 'app-addon-wrapper',
  templateUrl: './addon-wrapper.component.html',
  styleUrls: ['./addon-wrapper.component.scss'],
})
export class AddonWrapperComponent implements OnInit, OnDestroy {
  protected isDestroyed$ = new Subject<void>();

  constructor(protected router: Router, protected host: ElementRef) {}

  async ngOnInit(): Promise<void> {
    this.init(this.router.url);

    this.router.events.pipe(takeUntil(this.isDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Will trigger only when navigating from one addon to another
        this.init(event.url);
      }
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
    this.isDestroyed$.complete();
  }

  protected async init(url: string): Promise<void> {
    const componentName = url.replace(/.*\/addon\//, '').replace(/\/.*/, '');

    if (componentName) {
      const config = await this.getAddonConfig(componentName);

      if (config) {
        await this.initAddon(config, componentName);
      }
    }
  }

  protected async initAddon(
    config: AddonConfig,
    componentName: string
  ): Promise<void> {
    await this.loadScript(config.url, componentName);
    await this.loadComponent(config.remoteName, config.exposedModule);

    this.clearDom();
    this.appendComponentToDom(componentName);
  }

  protected clearDom(): void {
    while (this.host.nativeElement.lastChild) {
      this.host.nativeElement.removeChild(this.host.nativeElement.lastChild);
    }
  }

  protected appendComponentToDom(componentName: string): void {
    // We expect the remote module to register a web component
    const element = document.createElement(componentName);
    this.host.nativeElement.appendChild(element);
  }

  protected getAddonConfig(
    componentName: string
  ): Promise<AddonConfig | undefined> {
    return fetch('assets/addons-config.json').then(async (res) => {
      const config: AddonListConfig = await res.json();

      return config?.addons?.find((addon) =>
        addon.components.includes(componentName)
      );
    });
  }

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

  protected async loadComponent(scope: string, module: string): Promise<any> {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = (window as any)[scope];
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await (window as any)[scope].get(module);
    return factory();
  }
}
