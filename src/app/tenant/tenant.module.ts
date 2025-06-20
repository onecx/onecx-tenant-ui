import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { CalendarModule } from 'primeng/calendar'

import { providePortalDialogService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'

import { SharedModule } from 'src/app/shared/shared.module'
import { tenantFeature } from './tenant.reducers'
import { routes } from './tenant.routes'

import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component'
import { TenantSearchEffects } from './pages/tenant-search/tenant-search.effects'

@NgModule({
  providers: [providePortalDialogService()],
  declarations: [TenantSearchComponent],
  imports: [
    CalendarModule,
    CommonModule,
    EffectsModule.forFeature([TenantSearchEffects]),
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    SharedModule,
    StoreModule.forFeature(tenantFeature)
  ]
})
export class TenantModule {}
