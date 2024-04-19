import { createActionGroup, props } from '@ngrx/store';
import { Tenant } from '../generated';

export const TenantApiActions = createActionGroup({
  source: 'TenantApi',
  events: {
    'tenant search results received': props<{ 
      results: Tenant[];
      totalElements: number;
    }>(),
    'Tenant loading failed': props<{ error: any }>(),
  },
});

