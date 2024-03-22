import { combineReducers, createFeature } from '@ngrx/store';
import { TenantState } from './tenant.state';

export const tenantFeature = createFeature({
  name: 'tenant',
  reducer: combineReducers<TenantState>({}),
});
