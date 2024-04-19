import { Routes } from '@angular/router';
import { TenantSearchComponent } from './pages/tenant-search/tenant-search.component';

export const routes: Routes = [
  { path: '', component: TenantSearchComponent, pathMatch: 'full' },
];
