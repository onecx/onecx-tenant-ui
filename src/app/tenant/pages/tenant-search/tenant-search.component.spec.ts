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

import { PortalCoreModule } from '@onecx/portal-integration-angular'

import { TenantSearchActions } from './tenant-search.actions'
import { TenantSearchComponent } from './tenant-search.component'
import { initialState } from './tenant-search.reducers'

describe('TenantSearchComponent', () => {
  let component: TenantSearchComponent
  let fixture: ComponentFixture<TenantSearchComponent>
  let store: MockStore<Store>
  let formBuilder: FormBuilder

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
        )
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

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantSearchComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    formBuilder = TestBed.inject(FormBuilder)
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should dispatch searchButtonClicked action on search', (done) => {
    const formValue = formBuilder.group({
      changeMe: '123'
    })
    component.tenantSearchForm = formValue
    component.visibleFormControls = [
      {
        name: 'changeMe'
      }
    ] as any

    store.scannedActions$.pipe(ofType(TenantSearchActions.searchButtonClicked)).subscribe((a) => {
      expect(a.searchCriteria).toEqual({ changeMe: '123' })
      done()
    })

    component.search(formValue)
  })

  it('should dispatch resetButtonClicked action on resetSearch', (done) => {
    store.scannedActions$.pipe(ofType(TenantSearchActions.resetButtonClicked)).subscribe(() => {
      done()
    })

    component.resetSearch()
  })
})
