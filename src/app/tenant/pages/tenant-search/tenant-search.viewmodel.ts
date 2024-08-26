import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { SearchConfig, SearchConfigInfo } from 'src/app/shared/generated'
import { TenantSearchCriteria } from './tenant-search.parameters'

export interface TenantSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: TenantSearchCriteria
  results: RowListGridData[]
  searchConfigs: SearchConfigInfo[]
  selectedSearchConfig: SearchConfig | null
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchConfigEnabled: boolean
}
