import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/operators'

import { PortalMessageService } from '@onecx/portal-integration-angular'
import {
  createQueryParamsEffect,
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { TenantBffService } from '../../../shared/generated'
import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { selectSearchCriteria, tenantSearchSelectors } from './tenant-search.selectors'

@Injectable()
export class TenantSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private tenantService: TenantBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService
  ) {}

  pageName = 'tenant'

  resetButtonClicked$ = createQueryParamsEffect(
    this.actions$,
    TenantSearchActions.resetButtonClicked,
    this.router,
    this.route,
    () => ({})
  )

  searchButtonClicked$ = createQueryParamsEffect(
    this.actions$,
    TenantSearchActions.searchButtonClicked,
    this.router,
    this.route,
    (state, action) => ({
      ...state,
      ...action.searchCriteria
    })
  )

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, TenantSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, tenantSearchCriteriasSchema, true),
      concatLatestFrom(() => this.store.select(selectSearchCriteria)),
      switchMap(([, searchCriteria]) => {
        return this.tenantService.searchTenants(searchCriteria).pipe(
          map(({ stream, totalElements }) =>
            TenantSearchActions.tenantSearchResultsReceived({
              results: stream,
              totalElements
            })
          ),
          catchError((error) =>
            of(
              TenantSearchActions.tenantSearchResultsLoadingFailed({
                error
              })
            )
          )
        )
      })
    )
  })

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, TenantSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        TenantSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('tenantChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TenantSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('tenantChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: TenantSearchActions.tenantSearchResultsLoadingFailed,
      key: 'TENANT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}
