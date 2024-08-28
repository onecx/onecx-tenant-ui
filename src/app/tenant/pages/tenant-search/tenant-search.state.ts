import { DataTableColumn } from '@onecx/portal-integration-angular'
import { Tenant } from 'src/app/shared/generated'
import { TenantSearchCriteria } from './tenant-search.parameters'

export interface TenantSearchState {
  columns: DataTableColumn[]
  results: Tenant[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchConfigEnabled: boolean
}

export interface TenantSearchConfigState {
  columns: DataTableColumn[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  searchCriteria: TenantSearchCriteria
  searchConfigEnabled: boolean
}
