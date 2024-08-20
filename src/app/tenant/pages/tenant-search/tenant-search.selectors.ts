import { createSelector } from '@ngrx/store';
import {
  DataTableColumn,
  RowListGridData,
} from '@onecx/portal-integration-angular';
import { createChildSelectors } from '@onecx/portal-integration-angular/ngrx';
import { selectQueryParams } from 'src/app/shared/selectors/router.selectors';
import { tenantFeature } from '../../tenant.reducers';
import {
  TenantSearchCriteria,
  tenantSearchCriteriasSchema,
} from './tenant-search.parameters';
import { initialState } from './tenant-search.reducers';
import { TenantSearchConfigState } from './tenant-search.state';
import { TenantSearchViewModel } from './tenant-search.viewmodel';

export const tenantSearchSelectors = createChildSelectors(
  tenantFeature.selectSearch,
  initialState,
);
export const selectSearchCriteria = createSelector(
  selectQueryParams,
  (queryParams): TenantSearchCriteria => {
    const results = tenantSearchCriteriasSchema.safeParse(queryParams);
    if (results.success) {
      return results.data as TenantSearchCriteria;
    }
    return {};
  },
);

export const selectResults = createSelector(
  tenantSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      ...item,
      // ACTION S6: Here you can create a mapping of the items and their corresponding translation strings
    }));
  },
);

export const selectDisplayedColumns = createSelector(
  tenantSearchSelectors.selectColumns,
  tenantSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (
      (displayedColumns
        ?.map((d) => columns.find((c) => c.id === d))
        .filter((d) => d) as DataTableColumn[]) ?? []
    );
  },
);

export const selectTenantSearchViewModel = createSelector(
  tenantSearchSelectors.selectColumns,
  selectSearchCriteria,
  selectResults,
  tenantSearchSelectors.selectSearchConfigs,
  tenantSearchSelectors.selectSelectedSearchConfig,
  selectDisplayedColumns,
  tenantSearchSelectors.selectViewMode,
  tenantSearchSelectors.selectChartVisible,
  tenantSearchSelectors.selectSearchConfigEnabled,
  (
    columns,
    searchCriteria,
    results,
    searchConfigs,
    selectedSearchConfig,
    displayedColumns,
    viewMode,
    chartVisible,
    searchConfigEnabled,
  ): TenantSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    searchConfigs,
    selectedSearchConfig,
    displayedColumns,
    viewMode,
    chartVisible,
    searchConfigEnabled,
  }),
);

export const selectSearchConfigViewState = createSelector(
  tenantSearchSelectors.selectColumns,
  tenantSearchSelectors.selectSearchConfigs,
  tenantSearchSelectors.selectSelectedSearchConfig,
  selectDisplayedColumns,
  tenantSearchSelectors.selectViewMode,
  selectSearchCriteria,
  tenantSearchSelectors.selectSearchConfigEnabled,
  (
    columns,
    searchConfigs,
    selectedSearchConfig,
    displayedColumns,
    viewMode,
    searchCriteria,
    searchConfigEnabled,
  ): TenantSearchConfigState => ({
    columns,
    searchConfigs,
    selectedSearchConfig,
    displayedColumns,
    viewMode,
    searchCriteria,
    searchConfigEnabled,
  }),
);
