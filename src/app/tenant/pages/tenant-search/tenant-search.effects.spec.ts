import { Action, Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { TenantSearchEffects } from './tenant-search.effects'
import {
  SearchConfigBffService,
  TenantBffService,
  TenantSearchResponse,
} from 'src/app/shared/generated';
import { TestBed, getTestBed } from '@angular/core/testing';
import { TenantService } from 'src/app/shared/services/tenant.service';
import { TenantSearchActions } from './tenant-search.actions';
import { TenantApiActions } from 'src/app/shared/actions/tenant-api.actions';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  convertToParamMap,
} from '@angular/router';
import {
  PortalDialogService,
  PortalMessageService,
} from '@onecx/portal-integration-angular';
import {
  MockStore,
  createMockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';


describe('TenantSearchEffects:', () => {
    const mockedTenantService: Partial<TenantBffService> = {
      searchTenants: jest.fn(),
    };
    const mockedSearchConfigService: Partial<SearchConfigBffService> = {};
    const mockSuccessSearchResponse: TenantSearchResponse = {
      totalElements: 1,
      stream: [
        {
          orgId: 'asdf_1',
          modificationCount: 1,
          id: 1,
        },
      ],
    };
  
    let activatedRouteMock: Partial<ActivatedRoute> = {
      paramMap: of(convertToParamMap({ id: 1 })),
    };
    let mockedRouter: Partial<Router> = {
      events: of({} as any),
    };
  
    let store: MockStore;
    const initialState = {};
  
    const initEffects = (actions: Actions) => {
      return new TenantSearchEffects(
        actions,
        activatedRouteMock as ActivatedRoute,
        mockedTenantService as TenantBffService,
        mockedSearchConfigService as SearchConfigBffService,
        mockedRouter as Router,
        store,
        {} as PortalMessageService,
        {} as PortalDialogService
      );
    };
  
    beforeEach(() => {
      store = createMockStore({ initialState });
    });
  
    it('test', async () => {
      const actions = hot('-a', {
        a: TenantSearchActions.selectedSearchConfigInfo({
          searchConfigInfo: { id: '1', name: 'asd' },
        }),
      });

      let effects = initEffects(actions);
  
  
      const expected = hot('-a', {
        a: TenantSearchActions.tenantSearchResultsReceived({
          results: [],
          totalElements: 0,
        }),
      });
  
      expect(effects!.tmp$).toBeObservable(expected);
    });
  
    // it('TenantSearchActions.searchButtonClicked should dispatch TenantApiActions.tenantsReceived with the results', () => {
    //   const actions = hot('-a', {
    //     a: TenantSearchActions.searchButtonClicked({
    //       searchCriteria: { orgId: '' },
    //     }),
    //   });
    //   // console.log(ACTIONS____, TestBed.inject(Actions));
    //   // let effects = TestBed.inject(TenantSearchEffects);

  
    //   let effects = initEffects(actions);
  
    //   jest
    //     .spyOn(mockedTenantService, 'searchTenants')
    //     .mockReturnValue(cold('--a', { a: mockSuccessSearchResponse }));
  
    //   const expected = hot('---a', {
    //     a: TenantApiActions.tenantSearchResultsReceived({
    //       results: [
    //         {
    //           modificationCount: 1,
    //           id: 1,
    //           orgId: 'asdf_1',
    //         },
    //       ],
    //       totalElements: 1
    //     }),
    //   });
    // //   expect(mockedTenantService.searchTenants).toHaveBeenCalledTimes(1);
    //   expect(effects.searchByUrl$).toBe(expected);
    // });
  });