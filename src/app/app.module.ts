import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { KeycloakAuthModule } from '@onecx/keycloak-auth'
import {
  AppStateService,
  APP_CONFIG,
  ConfigurationService,
  PortalCoreModule,
  PortalMissingTranslationHandler,
  translateServiceInitializer,
  UserService,
  providePortalDialogService
} from '@onecx/portal-integration-angular'
import { environment } from 'src/environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { metaReducers, reducers } from './app.reducers'

import { Configuration } from './shared/generated'
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils'
import { createTranslateLoader } from '@onecx/angular-utils'

export const commonImports = [CommonModule]

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...commonImports,
    KeycloakAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LetDirective,
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
    EffectsModule.forRoot([]),
    PortalCoreModule.forRoot('onecx-tenant-ui'),
    TranslateModule.forRoot({
      extend: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: PortalMissingTranslationHandler
      }
    })
  ],
  providers: [
    providePortalDialogService(),
    { provide: APP_CONFIG, useValue: environment },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService]
    },
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService]
    },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
