import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  TenantCreateUpdateDialogResult,
  TenantCreateUpdateViewModel,
  TenantDialogMode
} from './tenant-create-update.types'
import { map } from 'rxjs'
import { ImagesAPIService } from 'src/app/shared/generated'
import { getImageUrl } from 'src/app/shared/utils/image.utils'
import { MenuItem } from 'primeng/api'

@Component({
  selector: 'app-tenant-create-update',
  templateUrl: './tenant-create-update.component.html',
  styleUrls: ['./tenant-create-update.component.scss']
})
export class TenantCreateUpdateComponent
  implements
    DialogPrimaryButtonDisabled,
    DialogResult<TenantCreateUpdateDialogResult | undefined>,
    DialogButtonClicked<TenantCreateUpdateComponent>,
    OnInit
{
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  @Input() public vm: TenantCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  @Input() public dialogMode: TenantDialogMode = TenantDialogMode.CREATE

  public formGroup!: FormGroup

  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  dialogResult: TenantCreateUpdateDialogResult | undefined = undefined
  dialogModeEnum = TenantDialogMode
  selectedTab: 'main' | 'internal' = 'main'
  hasExistingImage = true
  imageRemoved = false
  uploadedFile: File | null = null
  uploadedFilePreview: SafeUrl | null = null

  readonly menuItems: MenuItem[] = [
    {
      label: 'TENANT_CREATE_UPDATE.MENU.PROPERTIES',
      command: () => (this.selectedTab = 'main')
    },
    {
      label: 'TENANT_CREATE_UPDATE.MENU.INTERNAL',
      command: () => (this.selectedTab = 'internal')
    }
  ]

  private baseImagePath: string
  private uploadedFileUrl: string | null = null

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImagesAPIService,
    private sanitizer: DomSanitizer
  ) {
    this.baseImagePath = this.imageService.configuration.basePath!
  }

  ngOnInit() {
    this.initForm()
    this.adjustToDialogMode()
    if (this.dialogMode !== TenantDialogMode.DETAILS) {
      this.makeSubscriptions()
    }
  }

  ocxDialogButtonClicked() {
    this.dialogResult = {
      ...this.vm.itemToEdit,
      ...this.formGroup.value,
      image: this.uploadedFile,
      imageRemoved: this.imageRemoved
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      if (this.uploadedFileUrl) {
        URL.revokeObjectURL(this.uploadedFileUrl)
      }
      this.uploadedFile = file
      this.uploadedFileUrl = URL.createObjectURL(file)
      this.uploadedFilePreview = this.sanitizer.bypassSecurityTrustUrl(this.uploadedFileUrl)
      this.imageRemoved = false
      if (this.formGroup.valid) {
        this.primaryButtonEnabled.next(true)
      }
    }
  }

  handleFileRemove() {
    if (this.uploadedFileUrl) {
      URL.revokeObjectURL(this.uploadedFileUrl)
      this.uploadedFileUrl = null
      this.uploadedFilePreview = null
    }
    this.uploadedFile = null
    this.imageRemoved = true
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ''
    }
    if (this.formGroup.valid) {
      this.primaryButtonEnabled.next(true)
    }
  }

  onImageLoad() {
    this.hasExistingImage = true
  }

  onImageError() {
    this.hasExistingImage = false
  }

  getImageUrl(): string | undefined {
    if (this.dialogMode === TenantDialogMode.CREATE) {
      return undefined
    }
    return getImageUrl(this.baseImagePath, this.vm.itemToEdit!.id)
  }

  private initForm() {
    this.formGroup = this.formBuilder.group({
      orgId: [null, [Validators.required]],
      description: [null],
      tenantId: [{ value: null, disabled: true }, [Validators.required]],
      modificationUser: [{ value: null, disabled: true }],
      modificationDate: [{ value: null, disabled: true }],
      creationUser: [{ value: null, disabled: true }],
      creationDate: [{ value: null, disabled: true }]
    })
  }

  private adjustToDialogMode() {
    switch (this.dialogMode) {
      case TenantDialogMode.DETAILS:
        this.setDetailsMode()
        break
      case TenantDialogMode.CREATE:
        this.setCreateMode()
        break
      case TenantDialogMode.UPDATE:
        this.setUpdateMode()
        break
    }
  }

  private setCreateMode() {
    this.formGroup.get('tenantId')!.enable({ emitEvent: false })
  }

  private setUpdateMode() {
    this.formGroup.patchValue({
      ...this.vm.itemToEdit
    })
  }

  private setDetailsMode() {
    this.formGroup.patchValue({
      ...this.vm.itemToEdit
    })
    this.formGroup.disable()
    this.primaryButtonEnabled.next(true)
  }

  private makeSubscriptions() {
    this.formGroup.statusChanges
      .pipe(
        map((status) => {
          return status === 'VALID'
        })
      )
      .subscribe(this.primaryButtonEnabled)
  }
}
