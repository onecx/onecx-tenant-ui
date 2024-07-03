const { ModifyEntryPlugin } = require('@angular-architects/module-federation/src/utils/modify-entry-plugin')
const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const config = withModuleFederationPlugin({
  name: 'onecx-tenant-ui',
  filename: 'remoteEntry.js',
  exposes: {
    './OneCXTenantModule': './src/bootstrap.ts',
  },
  shared: share({
    '@angular/core': {
      singleton: true,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@angular/forms': {
      singleton: true,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@angular/common': {
      singleton: true,
      requiredVersion: 'auto',
      includeSecondaries: {
        skip: ['@angular/common/http/testing'],
      },
    },
    '@angular/common/http': {
      singleton: true,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@angular/router': {
      singleton: true,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    rxjs: {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@ngx-translate/core': { singleton: true, requiredVersion: 'auto' },
    '@onecx/accelerator': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/angular-auth': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/angular-webcomponents': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/integration-interface': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/angular-integration-interface': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/keycloak-auth': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/nx-plugin': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/portal-integration-angular': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/portal-layout-styles': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/accelerator': { requiredVersion: 'auto', includeSecondaries: true },
    '@onecx/integration-interface': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/keycloak-auth': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/portal-integration-angular': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
  }),

  sharedMappings: [],
});

module.exports = config;

const plugins = config.plugins.filter((plugin) => !(plugin instanceof ModifyEntryPlugin))

module.exports = {
  ...config,
  plugins,
  output: {
    uniqueName: 'onecx-tenant-ui',
    publicPath: 'auto'
  },
  experiments: {
    ...config.experiments,
    topLevelAwait: true
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: false
  }
}
