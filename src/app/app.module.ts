import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'

import { KeycloakAuthModule } from '@onecx/keycloak-auth'
import { APP_CONFIG, AppStateService, ConfigurationService, UserService } from '@onecx/angular-integration-interface'
import { createTranslateLoader } from '@onecx/angular-utils'
import {
  PortalCoreModule,
  providePortalDialogService,
  translateServiceInitializer
} from '@onecx/portal-integration-angular'

import { Configuration } from './shared/generated'
import { apiConfigProvider } from './shared/utils/apiConfigProvider.utils'

import { environment } from 'src/environments/environment'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { metaReducers, reducers } from './app.reducers'

export const commonImports = [CommonModule, BrowserModule, BrowserAnimationsModule]

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...commonImports,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    KeycloakAuthModule,
    LetDirective,
    PortalCoreModule.forRoot('onecx-tenant-ui'),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
    TranslateModule.forRoot({
      extend: true,
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] }
    })
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService]
    },
    provideHttpClient(withInterceptorsFromDi()),
    providePortalDialogService()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
