import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import {
  AppStateService,
  createTranslateLoader,
  PortalCoreModule,
  PortalMissingTranslationHandler
} from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component'
import { TenantSearchEffects } from './pages/tenant-search/tenant-search.effects'
import { tenantFeature } from './tenant.reducers'
import { routes } from './tenant.routes'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'

@NgModule({
  declarations: [TenantSearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(tenantFeature),
    EffectsModule.forFeature([TenantSearchEffects]),
    TranslateModule.forRoot({
      extend: true,
      isolate: false,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: PortalMissingTranslationHandler
      }
    })
  ]
})
export class TenantModule {}
