import { createActionGroup, props } from '@ngrx/store';
import { Tenant } from '../generated';

export const TenantApiActions = createActionGroup({
  source: 'TenantApi',
  events: {
    'Tenants received': props<{ stream: Tenant[] }>(),
    'Tenant loading failed': props<{ error: any }>(),
  },
});