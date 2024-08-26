import { createReducer, on } from '@ngrx/store'
import { TenantSearchActions } from './tenant-search.actions'
import { tenantSearchColumns } from './tenant-search.columns'
import { TenantSearchCriteria } from './tenant-search.parameters'
import { TenantSearchState } from './tenant-search.state'

export const initialState: TenantSearchState = {
  columns: tenantSearchColumns,
  results: [],
  searchConfigs: [],
  selectedSearchConfig: null,
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchConfigEnabled: false
}

export const tenantSearchReducer = createReducer(
  initialState,
  on(
    TenantSearchActions.resetButtonClicked,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      results: initialState.results,
      selectedSearchConfig: initialState.selectedSearchConfig
    })
  ),
  on(
    TenantSearchActions.tenantSearchResultsReceived,
    (state: TenantSearchState, { results }): TenantSearchState => ({
      ...state,
      results
    })
  ),
  on(
    TenantSearchActions.tenantSearchResultsLoadingFailed,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    TenantSearchActions.searchConfigInfosReceived,
    (state: TenantSearchState, { searchConfigInfos }): TenantSearchState => ({
      ...state,
      searchConfigs: searchConfigInfos,
      searchConfigEnabled: true,
      selectedSearchConfig: null
    })
  ),
  on(
    TenantSearchActions.searchConfigReceived,
    (state: TenantSearchState, { searchConfig }): TenantSearchState => ({
      ...state,
      selectedSearchConfig: searchConfig
    })
  ),
  on(
    TenantSearchActions.searchConfigInfoDeselected,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      selectedSearchConfig: null
    })
  ),
  on(
    TenantSearchActions.searchConfigReceived,
    (state: TenantSearchState, { searchConfig }): TenantSearchState => ({
      ...state,
      viewMode: searchConfig?.isAdvanced ? 'advanced' : 'basic',
      displayedColumns: searchConfig.columns.length ? searchConfig.columns : state.displayedColumns
    })
  ),
  on(
    TenantSearchActions.searchConfigCreatedSuccessfully,
    (state: TenantSearchState, { searchConfigInfos }): TenantSearchState => ({
      ...state,
      searchConfigs: searchConfigInfos
    })
  ),
  on(
    TenantSearchActions.searchConfigInfoDeselected,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      results: initialState.results,
      selectedSearchConfig: initialState.selectedSearchConfig
    })
  ),
  on(
    TenantSearchActions.searchButtonClicked,
    (state: TenantSearchState, { searchCriteria }): TenantSearchState => ({
      ...state,
      selectedSearchConfig:
        state.selectedSearchConfig &&
        Object.keys(searchCriteria).length == Object.keys(state.selectedSearchConfig?.values ?? {}).length &&
        Object.keys(searchCriteria).every(
          (k) => state.selectedSearchConfig?.values[k] === searchCriteria[k as keyof TenantSearchCriteria]
        )
          ? state.selectedSearchConfig
          : null
    })
  ),
  on(
    TenantSearchActions.chartVisibilityRehydrated,
    (state: TenantSearchState, { visible }): TenantSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    TenantSearchActions.chartVisibilityToggled,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    TenantSearchActions.viewModeChanged,
    (state: TenantSearchState, { viewMode }): TenantSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(TenantSearchActions.displayedColumnsChanged, (state: TenantSearchState, { displayedColumns }) => ({
    ...state,
    displayedColumns: displayedColumns.map((c) => c.id)
  }))
)
