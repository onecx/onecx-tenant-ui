import { DataTableColumn } from '@onecx/portal-integration-angular';
import { Tenant } from 'src/app/shared/generated';
import { TenantSearchCriteria } from './tenant-search.parameters';

export interface TenantSearchState {
  columns: DataTableColumn[];
  formValues: TenantSearchCriteria;
  configValues: TenantSearchCriteria;
  results: Tenant[];
  displayedColumns: string[] | null;
  viewMode: 'basic' | 'advanced';
  chartVisible: boolean;
}
