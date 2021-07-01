import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddonListConfig } from './addon-container-config.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  buttons: Array<{
    label: string;
    route: string;
  }> = [];

  constructor(protected router: Router, protected ngZone: NgZone) {
    (window as any).ngZone = this.ngZone;
  }

  async ngOnInit(): Promise<void> {
    const config: AddonListConfig = await fetch(
      'assets/addons-config.json'
    ).then((res) => res.json());

    if (config) {
      this.buttons = config.addons.map((addon) => ({
        label: addon.name,
        route: 'addon/' + addon.components[0],
      }));
    }
  }
}
