import { Action, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { TenantSearchEffects } from './tenant-search.effects';
import { TenantSearchResponse } from 'src/app/shared/generated';
import { TestBed } from '@angular/core/testing';
import { TenantService } from 'src/app/shared/services/tenant.service';
import { TenantSearchActions } from './tenant-search.actions';
import { TenantApiActions } from 'src/app/shared/actions/tenant-api.actions';
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PortalDialogService, PortalMessageService } from '@onecx/portal-integration-angular';
import { INJECTOR, Injector } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { Actions } from '@ngrx/effects';


describe('TenantSearchEffects:', () => {
    let actions$: Observable<any> = of();

    const mockedTenantService = {
        search: jest.fn()
    };
    const mockSuccessSearchResponse: TenantSearchResponse = {
        totalElements: 1,
        stream: [{
            orgId: 'asdf_1',
            modificationCount: 1,
            id: 1
        }],
    };
    let activatedRouteMock: Partial<ActivatedRoute>= { paramMap: of(convertToParamMap({id: 1})) }


    let routerSpy = jest.spyOn(Router.prototype, 'navigate');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                RouterTestingModule,
                RouterModule.forRoot([]),
                HttpClientTestingModule,
            ],
            providers: [
                provideMockActions(() => actions$),
                provideMockStore({}),
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Router, useValue: routerSpy },
                { provide: PortalMessageService, useValue: {} },
                { provide: PortalDialogService, useValue: {} },
                { provide: TenantService, useValue: { searchTenants: jest.fn() } },
                TenantSearchEffects,
            ],
        }).compileComponents();

        // let testbedInjector = TestBed.inject(INJECTOR) as any
        // testbedInjector.parent = Injector.create({providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }]})

        // console.log("Testbed Injector___",testbedInjector)
    });


    it('TenantSearchActions.searchButtonClicked should dispatch TenantApiActions.tenantsReceived with the results', () => {

        // actions$ = hot('-a', {
        //     a: TenantSearchActions.searchButtonClicked({ searchCriteria: { orgId: '' } }),
        // });
        console.log("TESTSTART____")
        console.log("ACTIONS____", TestBed.inject(Actions))
        let effects = TestBed.inject(TenantSearchEffects);

        mockedTenantService.search.mockReturnValue(
            cold('--a', { a: mockSuccessSearchResponse })
        );

        const expected = hot('---a', {
            a: TenantApiActions.tenantsReceived({
                stream: [{
                    modificationCount: 1,
                    id: 1,
                    orgId: 'asdf_1'
                }],
            }),
        });
        expect(effects.searchByUrl$).toBe(expected);
    });


    //   describe('TenantSearchActions.searchClicked', () => {
    //     it('should dispatch TenantApiActions.tenantsReceived with the results', () => {
    //       actions$ = hot('-a', {
    //         a: TenantSearchActions.searchButtonClicked({ searchCriteria: {orgId: ''}}),
    //       });

    //       mockedTenantService.search.mockReturnValue(
    //         cold('--a', { a: mockSuccessSearchResponse })
    //       );

    //       const expected = hot('---a', {
    //         a: TenantApiActions.tenantsReceived({
    //           stream: [{ 
    //             modificationCount:1, 
    //             id:1,
    //             orgId: 'asdf_1' }],
    //         }),
    //       });
    //       expect(effects.searchByUrl$).toBe(expected);
    //     });

    //     it('should dispatch TenantApiActions.tenantsReceived with empty results when response is empty', () => {
    //       actions$ = hot('-a', {
    //         a: TenantSearchActions.searchButtonClicked({ searchCriteria: {orgId: '1'}}),
    //       });

    //       mockedTenantService.search.mockReturnValue(
    //         cold('--a', { a: mockEmptySearchResponse })
    //       );

    //       const expected = hot('---a', {
    //         a: TenantApiActions.tenantsReceived({
    //           stream: [],
    //         }),
    //       });
    //       expect(effects.searchByUrl$).toBe(expected);
    //     });

    //     it('should not call the service when query is empty', () => {
    //       actions$ = hot('-a', {
    //         a: TenantSearchActions.searchButtonClicked({ searchCriteria: {orgId: ''}}),
    //       });

    //       const expected = hot('---');
    //       expect(effects.searchByUrl$).toBe(expected);
    //       expect(mockedTenantService.search).not.toHaveBeenCalled();
    //     });

    //     it('should dispatch TenantApiActions.tenantSearchResultsLoadingFailed when there is an error calling the service', () => {
    //       actions$ = hot('-a', {
    //         a: TenantSearchActions.searchButtonClicked({ searchCriteria: {orgId: '1'}}),
    //       });

    //       mockedTenantService.search.mockReturnValue(cold('--#'));

    //       const expected = hot('---a', {
    //         a: TenantApiActions.tenantLoadingFailed({
    //           error: 'error',
    //         }),
    //       });
    //       expect(effects.searchByUrl$).toBe(expected);
    //     });
    //   });
});