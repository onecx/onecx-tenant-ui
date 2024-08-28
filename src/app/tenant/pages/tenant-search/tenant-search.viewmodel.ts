import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { TenantSearchCriteria } from './tenant-search.parameters'

export interface TenantSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: TenantSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchConfigEnabled: boolean
}
