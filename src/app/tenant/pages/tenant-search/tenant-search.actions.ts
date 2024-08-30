import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DataTableColumn } from '@onecx/angular-accelerator';
import {
  SearchConfig,
  SearchConfigInfo,
  Tenant,
} from '../../../shared/generated';
import { TenantSearchCriteria } from './tenant-search.parameters';

export const TenantSearchActions = createActionGroup({
  source: 'TenantSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: TenantSearchCriteria;
    }>(),
    'Reset button clicked': emptyProps(),
    'Search config selected': props<{
      viewMode: 'advanced' | 'basic';
      displayedColumns: string[];
      values: TenantSearchCriteria;
    }>(),
    'Form values changed': props<{
      values: TenantSearchCriteria;
    }>(),
    'tenant search results received': props<{
      results: Tenant[];
      totalElements: number;
    }>(),
    'tenant search results loading failed': props<{ error: string | null }>(),
    'Displayed columns changed': props<{
      displayedColumns: DataTableColumn[];
    }>(),
    'Chart visibility rehydrated': props<{
      visible: boolean;
    }>(),
    'Chart visibility toggled': emptyProps(),
    'View mode changed': props<{
      viewMode: 'basic' | 'advanced';
    }>(),
  },
});
