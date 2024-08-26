import { createFeatureSelector } from '@ngrx/store'
import { tenantFeature } from './tenant.reducers'
import { TenantState } from './tenant.state'

export const selectTenantFeature = createFeatureSelector<TenantState>(tenantFeature.name)
