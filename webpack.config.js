const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const config = withModuleFederationPlugin({
  name: 'onecx-tenant-ui',
  filename: 'remoteEntry.js',
  exposes: {
    './OneCXTenantModule': './src/app/onecx-tenant-ui.remote.module.ts',
  },
  shared: share({
    '@angular/core': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@angular/forms': {
      requiredVersion: 'auto',
      includeSecondaries: true,
      eager: false,
    },
    '@angular/common': {
      requiredVersion: 'auto',
      includeSecondaries: {
        skip: ['@angular/common/http/testing'],
      },
    },
    '@angular/common/http': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@angular/router': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    rxjs: {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/portal-integration-angular': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/keycloak-auth': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@ngx-translate/core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^14.0.0',
    },
  }),

  sharedMappings: ['@onecx/portal-integration-angular'],
});

module.exports = config;
