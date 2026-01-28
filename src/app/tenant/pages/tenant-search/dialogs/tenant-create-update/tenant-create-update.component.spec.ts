/* eslint-disable @typescript-eslint/no-var-requires */
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { BreadcrumbService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TenantCreateUpdateComponent } from './tenant-create-update.component'
import { provideHttpClient } from '@angular/common/http'

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

describe('TenantCreateUpdateComponent', () => {
  let component: TenantCreateUpdateComponent
  let fixture: ComponentFixture<TenantCreateUpdateComponent>

  const mockActivatedRoute = {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantCreateUpdateComponent],
      imports: [
        PortalCoreModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations(
          'en',
          require('./../../../../../../assets/i18n/en.json')
        ).withTranslations('de', require('./../../../../../../assets/i18n/de.json')),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      providers: [BreadcrumbService, { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents()

    fixture = TestBed.createComponent(TenantCreateUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
