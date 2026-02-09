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
import { Tenant } from 'src/app/shared/generated'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateService } from '@ngx-translate/core'
import { map, of } from 'rxjs'
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
    // Rebuild diagramColumn$ after changing viewModel$
    component.diagramColumn$ = component.viewModel$.pipe(
      map((vm) => vm.columns.find((e) => e.id === component.diagramColumnId) as DataTableColumn)
    )

    component.diagramColumn$.subscribe((result) => {
      expect(result).toEqual(testColumn)
      done()
    })
  })

  it('should dispatch createTenantButtonClicked action when onCreateTenant is called', () => {
    jest.spyOn(store, 'dispatch')

    component.onCreateTenant()

    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.createTenantButtonClicked())
  })

  it('should dispatch openDialogForExistingEntry action when handleOpenEntryDetails is called', () => {
    jest.spyOn(store, 'dispatch')
    const tenant = { id: 'tenant-456', orgId: 'org2', tenantId: 'tenant2' }

    component.handleOpenEntryDetails(tenant as Tenant)

    expect(store.dispatch).toHaveBeenCalledWith(TenantSearchActions.openDialogForExistingEntry({ id: 'tenant-456' }))
  })

  it('should return image URL for given object ID', () => {
    const objectId = 'test-id-123'

    const result = component.getImageUrl(objectId)

    expect(result).toContain(objectId)
  })

  it('should remove id from failedImages when imageLoaded is called', () => {
    const testId = 'image-123'
    component['failedImages'].add(testId)

    component.imageLoaded(testId)

    expect(component.showDefaultIcon(testId)).toBe(false)
  })

  it('should add id to failedImages when imageLoadFailed is called', () => {
    const testId = 'image-456'

    component.imageLoadFailed(testId)

    expect(component.showDefaultIcon(testId)).toBe(true)
  })

  it('should return true when id is in failedImages', () => {
    const testId = 'failed-image'
    component['failedImages'].add(testId)

    expect(component.showDefaultIcon(testId)).toBe(true)
  })

  it('should return false when id is not in failedImages', () => {
    const testId = 'successful-image'

    expect(component.showDefaultIcon(testId)).toBe(false)
  })

  it('should set current card item and toggle menu when openMenu is called', () => {
    const mockMenu = { toggle: jest.fn() }
    const mockEvent = new Event('click')
    const tenant = { id: 'tenant-789', orgId: 'org3', tenantId: 'tenant3' } as Tenant

    component.openMenu(mockMenu, mockEvent, tenant)

    expect(component.currentCardItem).toEqual(tenant)
    expect(mockMenu.toggle).toHaveBeenCalledWith(mockEvent)
  })

  it('should dispatch displayedColumnsChanged action when onDisplayedColumnsChange is called', () => {
    jest.spyOn(store, 'dispatch')
    const columns: DataTableColumn[] = [
      { id: '1', nameKey: 'orgId', columnType: ColumnType.STRING },
      { id: '2', nameKey: 'tenantId', columnType: ColumnType.STRING }
    ]

    component.onDisplayedColumnsChange(columns)

    expect(store.dispatch).toHaveBeenCalledWith(
      TenantSearchActions.displayedColumnsChanged({ displayedColumns: columns })
    )
  })

  it('should clear text filter when clearTextFilters is called', () => {
    component.tenantFilterFormControl.setValue('test filter' as any)

    component.clearTextFilters()

    expect(component.tenantFilterFormControl.value).toBeNull()
  })

  it('should filter results when handleFilterChange is called with valid filter', () => {
    const viewModel: TenantSearchViewModel = {
      chartVisible: false,
      columns: [],
      displayedColumns: [],
      results: [
        { id: '1', orgId: 'org1', tenantId: 'tenant1', imagePath: '' },
        { id: '2', orgId: 'org2', tenantId: 'tenant2', imagePath: '' },
        { id: '3', orgId: 'org3', tenantId: 'test-tenant', imagePath: '' }
      ],
      searchCriteria: {},
      viewMode: 'basic'
    }

    component['handleFilterChange']('test', viewModel)

    component.filteredResults$.subscribe((results) => {
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('3')
    })
  })

  it('should return all results when handleFilterChange is called with empty filter', () => {
    const viewModel: TenantSearchViewModel = {
      chartVisible: false,
      columns: [],
      displayedColumns: [],
      results: [
        { id: '1', orgId: 'org1', tenantId: 'tenant1', imagePath: '' },
        { id: '2', orgId: 'org2', tenantId: 'tenant2', imagePath: '' }
      ],
      searchCriteria: {},
      viewMode: 'basic'
    }

    component['handleFilterChange']('', viewModel)

    component.filteredResults$.subscribe((results) => {
      expect(results.length).toBe(2)
    })
  })

  it('should return all results when handleFilterChange is called with null filter', () => {
    const viewModel: TenantSearchViewModel = {
      chartVisible: false,
      columns: [],
      displayedColumns: [],
      results: [
        { id: '1', orgId: 'org1', tenantId: 'tenant1', imagePath: '' },
        { id: '2', orgId: 'org2', tenantId: 'tenant2', imagePath: '' }
      ],
      searchCriteria: {},
      viewMode: 'basic'
    }

    component['handleFilterChange'](null, viewModel)

    component.filteredResults$.subscribe((results) => {
      expect(results.length).toBe(2)
    })
  })

  it('should filter by orgId when handleFilterChange is called', () => {
    const viewModel: TenantSearchViewModel = {
      chartVisible: false,
      columns: [],
      displayedColumns: [],
      results: [
        { id: '1', orgId: 'test-org', tenantId: 'tenant1', imagePath: '' },
        { id: '2', orgId: 'other-org', tenantId: 'tenant2', imagePath: '' }
      ],
      searchCriteria: {},
      viewMode: 'basic'
    }

    component['handleFilterChange']('test-org', viewModel)

    component.filteredResults$.subscribe((results) => {
      expect(results.length).toBe(1)
      expect(results[0]['orgId']).toBe('test-org')
    })
  })

  it('should filter by tenantId when handleFilterChange is called', () => {
    const viewModel: TenantSearchViewModel = {
      chartVisible: false,
      columns: [],
      displayedColumns: [],
      results: [
        { id: '1', orgId: 'org1', tenantId: 'special-tenant', imagePath: '' },
        { id: '2', orgId: 'org2', tenantId: 'tenant2', imagePath: '' }
      ],
      searchCriteria: {},
      viewMode: 'basic'
    }

    component['handleFilterChange']('special', viewModel)

    component.filteredResults$.subscribe((results) => {
      expect(results.length).toBe(1)
      expect(results[0]['tenantId']).toBe('special-tenant')
    })
  })

  it('should call actionCallback when headerActions$ is subscribed', (done) => {
    jest.spyOn(component, 'onCreateTenant')

    component.headerActions$.subscribe((actions) => {
      const createAction = actions.find((a) => a.labelKey === 'TENANT_CREATE_UPDATE.ACTION.CREATE')
      expect(createAction).toBeDefined()
      createAction?.actionCallback()
      expect(component.onCreateTenant).toHaveBeenCalled()
      done()
    })
  })
})
