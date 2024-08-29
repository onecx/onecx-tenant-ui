import { createSelector } from '@ngrx/store'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { selectQueryParams } from 'src/app/shared/selectors/router.selectors'
import { tenantFeature } from '../../tenant.reducers'
import { TenantSearchCriteria, tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { initialState } from './tenant-search.reducers'
import { TenantSearchViewModel } from './tenant-search.viewmodel'

export const tenantSearchSelectors = createChildSelectors(tenantFeature.selectSearch, initialState)
export const selectSearchCriteria = createSelector(selectQueryParams, (queryParams): TenantSearchCriteria => {
  const results = tenantSearchCriteriasSchema.safeParse(queryParams)
  if (results.success) {
    return results.data as TenantSearchCriteria
  }
  return {}
})

export const selectResults = createSelector(tenantSearchSelectors.selectResults, (results): RowListGridData[] => {
  return results.map((item) => ({
    imagePath: '',
    ...item
    // ACTION S6: Here you can create a mapping of the items and their corresponding translation strings
  }))
})

export const selectDisplayedColumns = createSelector(
  tenantSearchSelectors.selectColumns,
  tenantSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectTenantSearchViewModel = createSelector(
  tenantSearchSelectors.selectColumns,
  selectSearchCriteria,
  selectResults,
  selectDisplayedColumns,
  tenantSearchSelectors.selectViewMode,
  tenantSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): TenantSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
