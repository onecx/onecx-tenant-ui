import { createReducer, on } from '@ngrx/store'
import { TenantSearchActions } from './tenant-search.actions'
import { tenantSearchColumns } from './tenant-search.columns'
import { TenantSearchState } from './tenant-search.state'

export const initialState: TenantSearchState = {
  columns: tenantSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false
}

export const tenantSearchReducer = createReducer(
  initialState,
  on(
    TenantSearchActions.resetButtonClicked,
    (state: TenantSearchState): TenantSearchState => ({
      ...state,
      results: initialState.results
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
