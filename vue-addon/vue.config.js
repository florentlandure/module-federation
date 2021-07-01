const ModuleFederationPlugin = require('webpack').container
  .ModuleFederationPlugin;

module.exports = {
  publicPath: 'http://localhost:4001/', // Modify to set a different publicPath for dev and prod
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'vueAddon',
        filename: 'remoteEntry.js',
        exposes: {
          './web-component': './src/bootstrap.js',
        },
        shared: {
          vue: { singleton: true, eager: false, strictVersion: true },
        },
      }),
    ],
  },
  chainWebpack: (config) => {
    enableShadowCss(config);
  },
  css: {
    sourceMap: true,
    extract: false,
  },
  devServer: {
    port: 4001,
  },
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
