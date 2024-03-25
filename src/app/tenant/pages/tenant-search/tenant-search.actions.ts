import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DataTableColumn } from '@onecx/portal-integration-angular';
import {
  SearchConfig,
  SearchConfigInfo,
  TenantSearchResult,
} from '../../../shared/generated';
import { TenantSearchCriteria } from './tenant-search.parameters';

export const TenantSearchActions = createActionGroup({
  source: 'TenantSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: TenantSearchCriteria;
    }>(),
    'Reset button clicked': emptyProps(),

    'tenant search results received': props<{
      results: TenantSearchResult[];
      totalNumberOfResults: number;
    }>(),
    'tenant search results loading failed': props<{ error: string | null }>(),
    'Search config received': props<{
      searchConfig: SearchConfig;
    }>(),
    'Search configs loading failed': props<{
      error: string | null;
    }>(),
    'Search config selected': props<{
      searchConfig: SearchConfig | null;
    }>(),
    'Create search config clicked': emptyProps(),
    'Search config created successfully': props<{
      searchConfigInfos: SearchConfigInfo[];
    }>(),
    'Search config creation failed': props<{
      error: string | null;
    }>(),
    'Search config creation cancelled': emptyProps(),
    'Update search config clicked': emptyProps(),
    'Search config updated successfully': props<{
      searchConfigInfos: SearchConfigInfo[];
    }>(),
    'Search config update cancelled': emptyProps(),
    'Search config update failed': props<{
      error: string | null;
    }>(),

    'Search config infos received': props<{
      searchConfigInfos: SearchConfigInfo[];
    }>(),
    'Selected search config info': props<{
      searchConfigInfo: SearchConfigInfo;
    }>(),
    'Search config info deselected': emptyProps(),

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
