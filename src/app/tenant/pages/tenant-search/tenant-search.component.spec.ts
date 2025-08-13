import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { ofType } from '@ngrx/effects'
import { Store, StoreModule } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogService } from 'primeng/dynamicdialog'

import { ColumnType, DataTableColumn, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'

import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { initialState } from './tenant-search.reducers'
import { selectTenantSearchViewModel } from './tenant-search.selectors'
import { TenantSearchViewModel } from './tenant-search.viewmodel'
import { TenantSearchHarness } from './tenant-search.harness'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateService } from '@ngx-translate/core'
import { of } from 'rxjs'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { tenantSearchCriteriasSchema } from './tenant-search.parameters'

describe('TenantSearchComponent', () => {
  let component: TenantSearchComponent
  let fixture: ComponentFixture<TenantSearchComponent>
  let store: MockStore<Store>
  let formBuilder: FormBuilder
  let tenantSearch: TenantSearchHarness

  const mockActivatedRoute = {}

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
  })

  /* eslint-disable @typescript-eslint/no-var-requires */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantSearchComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        ),
        NoopAnimationsModule
      ],
      providers: [
        DialogService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: { tenant: { search: initialState } }
        }),
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents()
  })
  /* eslint-disable @typescript-eslint/no-var-requires */

  beforeEach(async () => {
    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    fixture = TestBed.createComponent(TenantSearchComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    formBuilder = TestBed.inject(FormBuilder)
    fixture.detectChanges()
    tenantSearch = await TestbedHarnessEnvironment.harnessForFixture(fixture, TenantSearchHarness)
    window.URL.createObjectURL = jest.fn()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should dispatch searchButtonClicked action on search', (done) => {
    const formValue = formBuilder.group({ changeMe: '123' })
    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'changeMe' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({ changeMe: '123' })
      done()
    })

    component.onSearch(formValue)
  })

  it('should dispatch resetButtonClicked action on reset search', (done) => {
    store.scannedActions$.pipe(ofType(TenantSearchActions.resetButtonClicked)).subscribe(() => {
      done()
    })

    component.onResetSearchCriteria()
  })

  it('should dispatch searchButtonClicked action on search', (done) => {
    const date = new Date()
    const formValue = formBuilder.group({ date: date })
    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'changeMe' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({ date: null })
    })
    done()

    component.onSearch(formValue)
  })

  it('should convert valid date to UTC and falsy value to null in searchCriteria', (done) => {
    const date = new Date(2023, 5, 15, 10, 30, 0)
    const formValue = formBuilder.group({
      validDate: date,
      emptyField: '',
      pageSize: '',
      pageNumber: undefined
    })

    component.tenantSearchForm = formValue
    component.visibleFormControls = [{ name: 'validDate' }, { name: 'emptyField' }] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({
        validDate: new Date(Date.UTC(2023, 5, 15, 10, 30, 0)),
        emptyField: null,
        pageSize: null,
        pageNumber: null
      })
    })
    done()

    component.onSearch(formValue)
  })

  it('should transform empty string to undefined', () => {
    const parsed = tenantSearchCriteriasSchema.parse({
      pageNumber: '',
      pageSize: ''
    })

    expect(parsed.pageNumber).toBeUndefined()
    expect(parsed.pageSize).toBeUndefined()
  })

  it('should dispatch view mode change', async () => {
    jest.spyOn(store, 'dispatch')
    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'basic'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false,
      viewMode: 'advanced'
    })
    store.refreshState()

    await tenantSearch.getHeader()

    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.viewModeChanged({ viewMode: 'advanced' }))
  })

  it('should dispatch chart visibility change', async () => {
    jest.spyOn(store, 'dispatch')
    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'advanced'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false
    })

    store.refreshState()
    const searchHeader = await tenantSearch.getHeader()
    const pageHeader = await searchHeader.getPageHeader()
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton()
    expect(overflowActionButton).toBeDefined()
    await overflowActionButton?.click()
    const showHideChartActionItem = await pageHeader.getOverFlowMenuItem('Show chart')
    await showHideChartActionItem?.selectItem()
    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.chartVisibilityToggled())

    //hide again
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: true
    })

    store.refreshState()
    const searchHeading = await tenantSearch.getHeader()
    const pageHeading = await searchHeading.getPageHeader()
    const overflowButton = await pageHeading.getOverflowActionMenuButton()
    expect(overflowButton).toBeDefined()
    await overflowButton?.click()
    const hideChartActionItem = await pageHeading.getOverFlowMenuItem('Show chart')
    await hideChartActionItem?.selectItem()
    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.chartVisibilityToggled())
  })

  it('should dispatch export', async () => {
    jest.spyOn(store, 'dispatch')
    jest.spyOn(component, 'onExportItems')

    const baseTenantSearchViewModel: TenantSearchViewModel = {
      chartVisible: true,
      columns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      displayedColumns: [{ columnType: ColumnType.STRING, id: '1', nameKey: 'orgId' }],
      results: [{ id: '1', imagePath: ' ' }],
      searchCriteria: { orgId: '1' },
      viewMode: 'advanced'
    }
    store.overrideSelector(selectTenantSearchViewModel, {
      ...baseTenantSearchViewModel,
      chartVisible: false
    })

    store.refreshState()

    const searchHeader = await tenantSearch.getHeader()
    const pageHeader = await searchHeader.getPageHeader()
    console.log(pageHeader.getInlineActionButtons())
    const overflowActionButton = await pageHeader.getOverflowActionMenuButton()
    expect(overflowActionButton).toBeDefined()
    await overflowActionButton?.click()
    const exportItem = await pageHeader.getOverFlowMenuItem('Export all')
    await exportItem?.selectItem()
    expect(component.onExportItems).toHaveBeenCalled()
  })
  it('should dispatch search config changed action when search config changed', async () => {
    jest.spyOn(store, 'dispatch')

    component.searchConfigInfoSelectionChanged({
      name: 'orgId',
      displayedColumnsIds: ['orgId'],
      fieldValues: { orgId: 'org1' },
      viewMode: 'advanced'
    })
    expect(store.dispatch).toHaveBeenCalledWith(
      TenantSearchActions.searchConfigSelected({
        searchConfig: {
          name: 'orgId',
          displayedColumnsIds: ['orgId'],
          fieldValues: { orgId: 'org1' },
          viewMode: 'advanced'
        }
      })
    )
  })
  it('should emit the correct diagram column', (done) => {
    const testColumnId = 'diagram123'

    const testColumn: DataTableColumn = {
      id: testColumnId,
      nameKey: 'diagram',
      columnType: ColumnType.STRING
    }

    const testViewModel: TenantSearchViewModel = {
      columns: [testColumn],
      displayedColumns: [],
      results: [],
      searchCriteria: {},
      chartVisible: false,
      viewMode: 'advanced'
    }

    component.diagramColumnId = testColumnId
    component.viewModel$ = of(testViewModel)

    component.diagramColumn$.subscribe((result) => {
      expect(result).toEqual(testColumn)
      done()
    })
    done()
  })
})
