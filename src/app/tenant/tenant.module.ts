import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { addInitializeModuleGuard, PortalCoreModule } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component'
import { TenantSearchEffects } from './pages/tenant-search/tenant-search.effects'
import { tenantFeature } from './tenant.reducers'
import { routes } from './tenant.routes'

@NgModule({
  declarations: [TenantSearchComponent],
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
    EffectsModule.forFeature([TenantSearchEffects])
  ]
})
export class TenantModule {}
