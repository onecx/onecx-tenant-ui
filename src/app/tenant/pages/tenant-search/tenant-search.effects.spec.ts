import { Type } from '@angular/core'
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterState,
  RouterStateSnapshot,
  RoutesRecognized
} from '@angular/router'
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store'
import { MockStore, createMockStore } from '@ngrx/store/testing'
import { ReplaySubject, of, throwError } from 'rxjs'
import { hot } from 'jest-marbles'

import { PortalMessageService } from '@onecx/angular-integration-interface'

import { TenantBffService } from 'src/app/shared/generated'
import { TenantSearchEffects } from './tenant-search.effects'
import { TenantSearchActions } from './tenant-search.actions'
import { tenantSearchSelectors } from './tenant-search.selectors'
import { TenantSearchComponent } from './tenant-search.component'

class MockRouter implements Partial<Router> {
  constructor(effectsActions: ReplaySubject<any>) {
    this.effectsActions = effectsActions
  }
  events = new ReplaySubject<any>(1)
  routerState = {
    root: {},
    snapshot: {
      root: {}
    }
  } as RouterState
  effectsActions: ReplaySubject<any>

  routeFor = (component: Type<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.root!.component! = component
  }

  setRouterUrl = (url: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.snapshot.url = url
  }

  configureNavigationUrl = (routerAction: RouterNavigatedAction, currentUrl: string, newUrl: string) => {
    this.setRouterUrl(currentUrl)
    routerAction.payload = {
      event: {
        urlAfterRedirects: newUrl
      }
    } as any
  }

  setRouterParams = (params: any) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.routerState!.snapshot.root.queryParams = params
  }

  configureQueryParams = (routerAction: RouterNavigatedAction, routerParams: any, actionParams: any) => {
    this.setRouterParams(routerParams)
    routerAction.payload = {
      routerState: {
        root: {
          queryParams: actionParams
        }
      }
    } as any
  }

  simulateNavigation = (routerAction: RouterNavigatedAction) => {
    ;(this.events as ReplaySubject<any>).next(new RoutesRecognized(0, '', '', {} as RouterStateSnapshot))
    this.effectsActions.next(routerAction)
  }

  navigate(commands: any[], extras?: NavigationExtras | undefined): Promise<boolean> {
    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    routerNavigatedAction.payload = {
      routerState: {
        root: {
          queryParams: extras?.queryParams
        }
      }
    } as any
    this.simulateNavigation(routerNavigatedAction)
    return Promise.resolve(true)
  }
}

describe('TenantSearchEffects:', () => {
  const activatedRouteMock: Partial<ActivatedRoute> = {}
  let mockedRouter: MockRouter
  let store: MockStore
  const initialState = {}

  const mockedTenantService: Partial<TenantBffService> = {
    searchTenants: jest.fn()
  }
  const mockedMessageService: Partial<PortalMessageService> = {
    error: jest.fn()
  }

  let effectsActions: ReplaySubject<any>
  const initEffects = () => {
    return new TenantSearchEffects(
      effectsActions,
      activatedRouteMock as ActivatedRoute,
      mockedTenantService as TenantBffService,
      mockedRouter as any,
      store,
      mockedMessageService as PortalMessageService
    )
  }

  beforeEach(() => {
    effectsActions = new ReplaySubject<any>(1)
    activatedRouteMock.queryParams = new ReplaySubject<any>(1)
    mockedRouter = new MockRouter(effectsActions)
    store = createMockStore({ initialState })
    jest.resetAllMocks()
  })

  it('should display error when TenantSearchActions.tenantSearchResultsLoadingFailed dispatched', (done) => {
    const effects = initEffects()
    effectsActions.next(
      TenantSearchActions.tenantSearchResultsLoadingFailed({
        error: null
      })
    )

    effects.displayError$.subscribe(() => {
      expect(mockedMessageService.error).toHaveBeenLastCalledWith({
        summaryKey: 'TENANT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
      })
      done()
    })
  })

  it('should not display error when action without error mapping dispatched', (done) => {
    const effects = initEffects()
    // any not mapped action
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.displayError$.subscribe(() => {
      expect(mockedMessageService.error).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should save visible: true to localStorage when TenantSearchActions.chartVisibilityToggled dispatched', (done) => {
    jest.spyOn(Storage.prototype, 'setItem')

    store.overrideSelector(tenantSearchSelectors.selectChartVisible, true)

    const effects = initEffects()
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.saveChartVisibility$.subscribe(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith('tenantChartVisibility', 'true')
      done()
    })
  })

  it('should save visible: false to localStorage when TenantSearchActions.chartVisibilityToggled dispatched', (done) => {
    jest.spyOn(Storage.prototype, 'setItem')

    store.overrideSelector(tenantSearchSelectors.selectChartVisible, false)

    const effects = initEffects()
    effectsActions.next(TenantSearchActions.chartVisibilityToggled())

    effects.saveChartVisibility$.subscribe(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith('tenantChartVisibility', 'false')
      done()
    })
  })

  it('should dispatch TenantSearchActions.chartVisibilityRehydrated with visible: true on TenantSearchComponent route navigation', (done) => {
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem')
    localStorageSpy.mockReturnValue('true')

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureNavigationUrl(routerNavigatedAction, 'current_url', 'navigation_url')
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.rehydrateChartVisibility$.subscribe((action) => {
      expect(action.visible).toBe(true)
      done()
    })
  })

  it('should dispatch TenantSearchActions.chartVisibilityRehydrated with visible: false on TenantSearchComponent route navigation', (done) => {
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem')
    localStorageSpy.mockReturnValue('false')

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureNavigationUrl(routerNavigatedAction, 'current_url', 'navigation_url')
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.rehydrateChartVisibility$.subscribe((action) => {
      expect(action.visible).toBe(false)
      done()
    })
  })

  it('should dispatch TenantSearchActions.tenantSearchResultsReceived with search results on new search criteria', (done) => {
    const tenants = {
      stream: [
        {
          id: '1'
        },
        {
          id: '2'
        }
      ],
      totalElements: 2
    }
    jest.spyOn(mockedTenantService, 'searchTenants').mockReturnValue(of(tenants) as any)

    const previousSearchCriteriaParams = {
      orgId: 'prev_org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteriaParams = {
      orgId: 'org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }
    store.overrideSelector(tenantSearchSelectors.selectCriteria, newSearchCriteria)

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, previousSearchCriteriaParams, newSearchCriteriaParams)
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.searchByUrl$.subscribe((action) => {
      expect(mockedTenantService.searchTenants).toHaveBeenLastCalledWith(newSearchCriteria)
      expect(action).toEqual({
        type: TenantSearchActions.tenantSearchResultsReceived.type,
        results: tenants.stream,
        totalElements: tenants.totalElements
      })
      done()
    })
  })

  it('should dispatch TenantSearchActions.tenantSearchResultsLoadingFailed when search call fails on new search criteria', (done) => {
    const error = {
      cause: 'Bad org id'
    }
    jest.spyOn(mockedTenantService, 'searchTenants').mockReturnValue(throwError(() => error))

    const previousSearchCriteriaParams = {
      orgId: 'prev_org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteriaParams = {
      orgId: 'org_id',
      pageNumber: '1',
      pageSize: '1'
    }
    const newSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }
    store.overrideSelector(tenantSearchSelectors.selectCriteria, newSearchCriteria)

    const effects = initEffects()

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, previousSearchCriteriaParams, newSearchCriteriaParams)
    mockedRouter.simulateNavigation(routerNavigatedAction)

    effects.searchByUrl$.subscribe((action) => {
      expect(mockedTenantService.searchTenants).toHaveBeenLastCalledWith(newSearchCriteria)
      expect(action).toEqual({
        type: TenantSearchActions.tenantSearchResultsLoadingFailed.type,
        error: error
      })
      done()
    })
  })

  it('should not dispatch anything via searchByUrl on same search criteria', () => {
    const sameSearchCriteria = {
      orgId: 'org_id',
      pageNumber: 1,
      pageSize: 1
    }

    const routerNavigatedAction = {
      type: ROUTER_NAVIGATED
    } as RouterNavigatedAction
    mockedRouter.routeFor(TenantSearchComponent)
    mockedRouter.configureQueryParams(routerNavigatedAction, sameSearchCriteria, { orgId: 'ass' })

    const effects = initEffects()
    effectsActions.next(
      hot('-a', {
        a: routerNavigatedAction
      })
    )

    const expected = hot('--')

    expect(effects.searchByUrl$).toBeObservable(expected)
  })

  it('should navigate when query params are different than search criteria on TenantSearchActions.searchButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next({
      orgId: 'orgId'
    })
    store.overrideSelector(tenantSearchSelectors.selectCriteria, { orgId: 'differentId' })
    effectsActions.next(
      TenantSearchActions.searchButtonClicked({
        searchCriteria: { orgId: '' }
      })
    )

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should not navigate when query params are same as search criteria on TenantSearchActions.searchButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const criteria = {
      orgId: 'orgId'
    }

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next(criteria)
    store.overrideSelector(tenantSearchSelectors.selectCriteria, criteria)
    effectsActions.next(
      TenantSearchActions.searchButtonClicked({
        searchCriteria: { orgId: '' }
      })
    )

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should navigate when query params are different than search criteria on TenantSearchActions.resetButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next({
      orgId: 'orgId'
    })
    store.overrideSelector(tenantSearchSelectors.selectCriteria, { orgId: 'differentId' })
    effectsActions.next(TenantSearchActions.resetButtonClicked())

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should not navigate when query params are same as search criteria on TenantSearchActions.resetButtonClicked dispatch', (done) => {
    const spy = jest.spyOn(mockedRouter, 'navigate')

    const criteria = {
      orgId: 'orgId'
    }

    const effects = initEffects()
    ;(activatedRouteMock.queryParams as ReplaySubject<any>).next(criteria)
    store.overrideSelector(tenantSearchSelectors.selectCriteria, criteria)
    effectsActions.next(TenantSearchActions.resetButtonClicked())

    effects.syncParamsToUrl$.subscribe(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
  })
})
