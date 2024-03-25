import { combineReducers, createFeature } from '@ngrx/store';
import { tenantSearchReducer } from './pages/tenant-search/tenant-search.reducers';
import { TenantState } from './tenant.state';

export const tenantFeature = createFeature({
  name: 'tenant',
  reducer: combineReducers<TenantState>({
    search: tenantSearchReducer,
  }),
});
