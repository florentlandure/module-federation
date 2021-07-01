export interface AddonListConfig {
  addons: AddonConfig[];
}

export interface AddonConfig {
  name: string;
  components: string[];
  url: string;
  remoteName: string;
  exposedModule: string;
  permissions: string[];
  nav?: any[];
}
