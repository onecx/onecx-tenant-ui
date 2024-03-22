import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { addInitializeModuleGuard } from '@onecx/portal-integration-angular';

export const routes: Routes = [
  {
    path: 'tenant',
    loadChildren: () =>
      import('./tenant/tenant.module').then((mod) => mod.TenantModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
