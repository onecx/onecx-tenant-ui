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
import { TenantSearchViewModel } from './tenant-search.viewmodel';

export const tenantSearchSelectors = createChildSelectors(
  tenantFeature.selectSearch,
  initialState,
);

export const selectFormValues = createSelector(
  tenantSearchSelectors.selectFormValues,
  (formValues): TenantSearchCriteria => formValues,
);

export const selectConfigValues = createSelector(
  tenantSearchSelectors.selectConfigValues,
  (values): TenantSearchCriteria => values,
);

export const selectSearchCriteria = createSelector(
  selectQueryParams,
  (queryParams): TenantSearchCriteria => {
    const results = tenantSearchCriteriasSchema.safeParse(queryParams);
    if (results.success) {
      return results.data as TenantSearchCriteria;
    }
    // let customResults: TenantSearchCriteria = {};
    // if (queryParams['orgId']) {
    //   customResults['orgId'] = queryParams['orgId'];
    // }
    // if (queryParams['id']) {
    //   customResults['id'] = queryParams['id'];
    // }
    // if (queryParams['id']) {
    //   customResults['id'] = queryParams['id'];
    // }
    // if (queryParams['pageNumber']) {
    //   customResults['pageNumber'] = Number(queryParams['pageNumber']);
    // }
    // if (queryParams['pageSize']) {
    //   customResults['pageSize'] = Number(queryParams['pageSize']);
    // }
    // return customResults;
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
  tenantSearchSelectors.selectFormValues,
  selectResults,
  selectDisplayedColumns,
  tenantSearchSelectors.selectViewMode,
  tenantSearchSelectors.selectChartVisible,
  (
    columns,
    formValues,
    results,
    displayedColumns,
    viewMode,
    chartVisible,
  ): TenantSearchViewModel => ({
    columns,
    formValues,
    results,
    displayedColumns,
    viewMode,
    chartVisible,
  }),
);
