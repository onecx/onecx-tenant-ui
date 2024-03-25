import { DataTableColumn } from '@onecx/portal-integration-angular';
import {
  SearchConfig,
  SearchConfigInfo,
  TenantSearchResult,
} from 'src/app/shared/generated';
import { TenantSearchCriteria } from './tenant-search.parameters';

export interface TenantSearchState {
  columns: DataTableColumn[];
  results: TenantSearchResult[];
  searchConfigs: SearchConfigInfo[];
  selectedSearchConfig: SearchConfig | null;
  displayedColumns: string[] | null;
  viewMode: 'basic' | 'advanced';
  chartVisible: boolean;
  searchConfigEnabled: boolean;
}

export interface TenantSearchConfigState {
  columns: DataTableColumn[];
  searchConfigs: SearchConfigInfo[];
  selectedSearchConfig: SearchConfig | null;
  displayedColumns: DataTableColumn[];
  viewMode: 'basic' | 'advanced';
  searchCriteria: TenantSearchCriteria;
  searchConfigEnabled: boolean;
}
