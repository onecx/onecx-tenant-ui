import { PortalDialogService } from '@onecx/portal-integration-angular'
import { forkJoin, mergeMap, Observable } from 'rxjs'
import {
  CreateTenantRequest,
  UpdateTenantRequest,
  ImagesAPIService,
  UploadImageRequestParams,
  RefType
} from 'src/app/shared/generated'
import { TenantCreateUpdateComponent } from './dialogs/tenant-create-update/tenant-create-update.component'
import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/operators'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import equal from 'fast-deep-equal'

import { PortalMessageService } from '@onecx/angular-integration-interface'
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'

import { TenantAPIService } from '../../../shared/generated'
import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { TenantSearchCriteria, tenantSearchCriteriasSchema } from './tenant-search.parameters'
import { tenantSearchSelectors } from './tenant-search.selectors'
import {
  TenantCreateUpdateDialogResult,
  TenantDialogMode
} from './dialogs/tenant-create-update/tenant-create-update.types'

@Injectable()
export class TenantSearchEffects {
  constructor(
    private portalDialogService: PortalDialogService,
    private readonly actions$: Actions,
    @SkipSelf() private readonly route: ActivatedRoute,
    private readonly tenantService: TenantAPIService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly messageService: PortalMessageService,
    private readonly imageService: ImagesAPIService
  ) {}

  pageName = 'tenant'

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TenantSearchActions.searchButtonClicked, TenantSearchActions.resetButtonClicked),
        concatLatestFrom(() => [this.store.select(tenantSearchSelectors.selectCriteria), this.route.queryParams]),
        tap(([, criteria, queryParams]) => {
          const results = tenantSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  refreshSearchAfterCreateUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantSearchActions.createTenantSucceeded, TenantSearchActions.updateTenantSucceeded),
      concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  editButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantSearchActions.editTenantButtonClicked),
      concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToEdit) => {
        return this.portalDialogService.openDialog<TenantCreateUpdateDialogResult | undefined>(
          'TENANT_CREATE_UPDATE.UPDATE.HEADER',
          {
            type: TenantCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit
              },
              dialogMode: TenantDialogMode.UPDATE
            }
          },
          'TENANT_CREATE_UPDATE.UPDATE.FORM.SAVE',
          'TENANT_CREATE_UPDATE.UPDATE.FORM.CANCEL',
          {
            baseZIndex: 100,
            width: '1000px'
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(TenantSearchActions.updateTenantCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = dialogResult.result.id
        const itemToEdit: UpdateTenantRequest = {
          orgId: dialogResult.result.orgId!,
          description: dialogResult.result.description!
        }
        const updateOperations: Observable<any>[] = [
          this.tenantService.updateTenant({ id: itemToEditId, updateTenantRequest: itemToEdit })
        ]
        if (dialogResult.result.image) {
          const uploadParams: UploadImageRequestParams = {
            refId: itemToEditId,
            refType: RefType.Logo,
            body: dialogResult.result.image
          }
          updateOperations.push(this.imageService.uploadImage(uploadParams))
        }
        return forkJoin(updateOperations).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'TENANT_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return TenantSearchActions.updateTenantSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'TENANT_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          TenantSearchActions.updateTenantFailed({
            error
          })
        )
      })
    )
  })

  createButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TenantSearchActions.createTenantButtonClicked),
      switchMap(() => {
        return this.portalDialogService.openDialog<TenantCreateUpdateDialogResult | undefined>(
          'TENANT_CREATE_UPDATE.CREATE.HEADER',
          {
            type: TenantCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit: undefined
              },
              dialogMode: TenantDialogMode.CREATE
            }
          },
          'TENANT_CREATE_UPDATE.CREATE.FORM.SAVE',
          'TENANT_CREATE_UPDATE.CREATE.FORM.CANCEL',
          {
            baseZIndex: 100,
            width: '1000px'
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(TenantSearchActions.createTenantCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToCreate: CreateTenantRequest = {
          orgId: dialogResult.result.orgId!,
          description: dialogResult.result.description!,
          tenantId: dialogResult.result.tenantId!
        }
        return this.tenantService.createTenant({ createTenantRequest: itemToCreate }).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'TENANT_CREATE_UPDATE.CREATE.SUCCESS'
            })
            return TenantSearchActions.createTenantSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'TENANT_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(
          TenantSearchActions.createTenantFailed({
            error
          })
        )
      })
    )
  })

  openDetailsButtonClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TenantSearchActions.openTenantDetailsButtonClicked),
        concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectResults)),
        map(([action, results]) => {
          return results.find((item) => item.id == action.id)
        }),
        switchMap((tenantDetails) => {
          return this.portalDialogService.openDialog<TenantCreateUpdateDialogResult | undefined>(
            'TENANT_CREATE_UPDATE.DETAILS.HEADER',
            {
              type: TenantCreateUpdateComponent,
              inputs: {
                vm: {
                  itemToEdit: tenantDetails
                },
                dialogMode: TenantDialogMode.DETAILS
              }
            },
            'TENANT_CREATE_UPDATE.DETAILS.BUTTON',
            undefined,
            {
              baseZIndex: 100,
              width: '1000px'
            }
          )
        })
      )
    },
    { dispatch: false }
  )

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, TenantSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, tenantSearchCriteriasSchema, true),
      concatLatestFrom(() => this.store.select(tenantSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
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

  private performSearch(searchCriteria: TenantSearchCriteria) {
    return this.tenantService.searchTenants({ tenantSearchCriteria: searchCriteria }).pipe(
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
  }
}
