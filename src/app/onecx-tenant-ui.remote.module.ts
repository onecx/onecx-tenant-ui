import { HttpClient } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Actions,
  EffectsModule,
  EffectSources,
  EffectsRunner,
} from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  addInitializeModuleGuard,
  AppStateService,
  ConfigurationService,
  createTranslateLoader,
  PortalCoreModule,
  PortalMissingTranslationHandler,
} from '@onecx/portal-integration-angular';
import { DialogService } from 'primeng/dynamicdialog';
import { routes } from './app-routing.module';
import { commonImports } from './app.module';
import { metaReducers, reducers } from './app.reducers';
import { Configuration } from './shared/generated';
import { SharedModule } from './shared/shared.module';
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils';

// Workaround for the following issue:
// https://github.com/ngrx/platform/issues/3700
const effectProvidersForWorkaround = [EffectsRunner, EffectSources, Actions];
effectProvidersForWorkaround.forEach((p) => (p.ɵprov.providedIn = null));

@NgModule({
  imports: [
    ...commonImports,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    TranslateModule.forRoot({
      extend: true,
      isolate: false,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: PortalMissingTranslationHandler,
      },
    }),
    SharedModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effectProvidersForWorkaround),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
  ],
  exports: [],
  providers: [
    DialogService,
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService],
    },
  ],
})
export class OneCXTenantModule {}
