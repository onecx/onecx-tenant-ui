/* eslint-disable @typescript-eslint/no-var-requires */
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { BreadcrumbService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TenantCreateUpdateComponent } from './tenant-create-update.component'
import { provideHttpClient } from '@angular/common/http'
import { Configuration, ImagesAPIService } from 'src/app/shared/generated'
import { TenantCreateUpdateViewModel, TenantDialogMode } from './tenant-create-update.types'
import { FileSelectEvent } from 'primeng/fileupload'

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

const viewModel: TenantCreateUpdateViewModel = {
  itemToEdit: {
    id: '1',
    orgId: '1',
    tenantId: 'Tenant1',
    description: 'Description 1'
  }
}

describe('TenantCreateUpdateComponent', () => {
  let component: TenantCreateUpdateComponent
  let fixture: ComponentFixture<TenantCreateUpdateComponent>

  const mockActivatedRoute = {}
  const mockedImageService: Partial<ImagesAPIService> = {
    configuration: new Configuration({
      basePath: '/test'
    })
  }

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
        ).withTranslations('de', require('./../../../../../../assets/i18n/de.json'))
      ],
      providers: [
        BreadcrumbService,
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ImagesAPIService, useValue: mockedImageService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(TenantCreateUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('in create mode', () => {
    it('should set component properly', () => {
      component.dialogMode = TenantDialogMode.CREATE
      component.ngOnInit()

      expect(component.formGroup).toBeDefined()
      expect(component.showImage).toEqual(false)
      expect(component.formGroup.get('tenantId')?.enabled).toEqual(true)
    })

    it('should return empty image url', () => {
      component.dialogMode = TenantDialogMode.CREATE
      component.ngOnInit()

      const url = component.getImageUrl()
      expect(url).toBeUndefined()
    })

    it('should enable primary button when all data is set', (done) => {
      component.dialogMode = TenantDialogMode.CREATE
      component.ngOnInit()

      component.primaryButtonEnabled.subscribe((btnEnabled) => {
        expect(btnEnabled).toEqual(true)
        done()
      })

      const item = viewModel.itemToEdit!
      component.formGroup.patchValue({ orgId: item.orgId, tenantId: item.tenantId })
    })

    it('should set proper dialog result', () => {
      component.dialogMode = TenantDialogMode.CREATE
      component.ngOnInit()
      const item = viewModel.itemToEdit!
      component.formGroup.patchValue({ orgId: item.orgId, tenantId: item.tenantId })
      component.ocxDialogButtonClicked()
      const { orgId, tenantId, image } = component.dialogResult!

      expect(orgId).toEqual(item.orgId)
      expect(tenantId).toEqual(item.tenantId)
      expect(image).toBeNull()
    })
  })

  describe('in edit mode', () => {
    it('should set component properly', () => {
      component.dialogMode = TenantDialogMode.UPDATE
      component.vm = viewModel
      component.ngOnInit()

      expect(component.formGroup).toBeDefined()
      expect(component.formGroup.get('tenantId')?.enabled).toEqual(false)
      expect(component.formGroup.value['orgId']).toEqual(viewModel.itemToEdit?.orgId)
    })

    it('should enable primary button when data is changed', (done) => {
      component.dialogMode = TenantDialogMode.UPDATE
      component.vm = viewModel
      component.primaryButtonEnabled.subscribe((btnEnabled) => {
        expect(btnEnabled).toEqual(true)
        expect(component.formGroup.value['orgId']).toEqual('Org2')
        done()
      })
      component.ngOnInit()
      component.formGroup.patchValue({ orgId: 'Org2' })
    })

    it('should enable button when image is uploaded', (done) => {
      component.dialogMode = TenantDialogMode.UPDATE
      component.vm = viewModel
      component.ngOnInit()

      component.primaryButtonEnabled.subscribe((btnEnabled) => {
        expect(btnEnabled).toEqual(true)
        done()
      })

      const event: Partial<FileSelectEvent> = {
        files: [new Blob() as File]
      }
      component.handleImageSelect(event as FileSelectEvent)
      component.ocxDialogButtonClicked()
      expect(component.dialogResult?.image).toBeDefined()
    })

    it('should emit true then false when form validity changes', (done) => {
      component.dialogMode = TenantDialogMode.UPDATE
      component.vm = viewModel
      component.ngOnInit()

      const emittedValues: boolean[] = []
      component.primaryButtonEnabled.subscribe((btnEnabled) => {
        emittedValues.push(btnEnabled)

        if (emittedValues.length === 2) {
          expect(emittedValues[0]).toEqual(true)
          expect(emittedValues[1]).toEqual(false)
          done()
        }
      })

      // First patch - form becomes valid
      component.formGroup.patchValue({ orgId: 'Org2' })

      // Second patch - form becomes invalid
      component.formGroup.patchValue({ orgId: null })
    })

    it('should handle image remove', () => {
      component.dialogMode = TenantDialogMode.UPDATE
      component.vm = viewModel
      component.ngOnInit()

      const event: Partial<FileSelectEvent> = {
        files: [new Blob() as File]
      }
      component.handleImageSelect(event as FileSelectEvent)
      component.ocxDialogButtonClicked()
      expect(component.dialogResult?.image).toBeDefined()
      component.handleFileRemove()
      component.ocxDialogButtonClicked()
      expect(component.dialogResult?.image).toBeNull()
    })
  })

  describe('in details mode', () => {
    it('should set component properly', (done) => {
      component.dialogMode = TenantDialogMode.DETAILS
      component.vm = viewModel

      component.primaryButtonEnabled.subscribe((btnEnabled) => {
        expect(component.formGroup.getRawValue()['orgId']).toEqual(viewModel.itemToEdit?.orgId)
        expect(component.formGroup.disabled).toEqual(true)
        expect(btnEnabled).toEqual(true)
        done()
      })

      component.ngOnInit()
    })

    it('should return proper image url', () => {
      component.dialogMode = TenantDialogMode.DETAILS
      component.vm = viewModel

      const url = component.getImageUrl()
      expect(url).toContain(viewModel.itemToEdit?.id)
    })

    it('should handle image load error', () => {
      component.dialogMode = TenantDialogMode.DETAILS
      component.vm = viewModel

      component.handleLoadImageError()
      expect(component.showImage).toEqual(false)
    })
  })
})
