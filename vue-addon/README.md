# Vue addon with module federation

The project was generated with [Vue cli](https://cli.vuejs.org)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

Run `npm run serve` for a dev server. Navigate to `http://localhost:4001/`. The app will automatically reload if you change any of the source files.

### Compiles and minifies for production

```
npm run build
```

## Module federation

Module federation is added by updating the `vue.config.js` file.

```javascript
module.exports = {
  // ...
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'vueAddon',
        filename: 'remoteEntry.js',
        exposes: {
          './web-component': './src/main.js',
        },
        shared: {
          vue: { singleton: true, strictVersion: true },
          'vue-custom-element': { singleton: true, strictVersion: true },
        },
      }),
    ],
  },
  // ...
};
```

### Web component

We use `@vue/web-component-wrapper` to wrap the vue app in a web component.

```javascript
// main.js

import Vue from 'vue';
import App from './App.vue';
import wrap from '@vue/web-component-wrapper';

Vue.config.productionTip = false;

const CustomElement = wrap(Vue, App);
window.customElements.define('vue-addon', CustomElement);
```

We need to modify the vue config in order to have the styles inside the shadowDom.

```javascript
// vue.config.js

module.exports = {
  // ...
  chainWebpack: (config) => {
    enableShadowCss(config);
  },
  css: {
    sourceMap: true,
    extract: false,
  },
  // ...
};

function enableShadowCss(config) {
  const configs = [config.module.rule('vue').use('vue-loader')];
  // based on common rules returned by `vue inspect`
  const ruleSets = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
  const ruleNames = ['vue-modules', 'vue', 'normal-modules', 'normal'];

  ruleSets.forEach((ruleSet) => {
    if (config.module.rules.store.has(ruleSet)) {
      ruleNames.forEach((rName) => {
        if (config.module.rule(ruleSet).oneOfs.store.has(rName)) {
          if (
            config.module
              .rule(ruleSet)
              .oneOf(rName)
              .uses.store.has('vue-style-loader')
          ) {
            configs.push(
              config.module
                .rule(ruleSet)
                .oneOf(rName)
                .use('vue-style-loader')
            );
          }
        }
      });
    }
  });
  if (!process.env.BUILD_MODE) {
    process.env.BUILD_MODE = config.store.get('mode');
  }
  configs.forEach((c) =>
    c.tap((options) => {
      options.shadowMode = true;
      return options;
    })
  );
}
```

### Routing

The addon is not always hosted on the root path. So we need to setup the router in order to catch the last part of the path instead of the whole path.

```javascript
const routes = [
  {
    path: '*/',
    component: MainPage,
  },
  {
    path: '*/other',
    component: () => import('./views/OtherPage.vue'),
  },
  {
    path: '*',
    redirect: '',
  },
];
```

The router needs to use hash mode.  
Additionally, we need to prepend the basePath when navigating to an internal route.

```javascript
// Always prepend the basePath to the route
router.beforeEach((to, from, next) => {
  if (!to.path.includes(basePath)) {
    next(basePath + to.path);
  } else {
    next();
  }
});
```

The router links must always be absolute:

```html
<router-link to="/other" tag="button">Other Page</router-link>
```

Internal routing can be triggered directly using vue-router.  
External routing (outside of the addon) need to use the SDK's router API.
