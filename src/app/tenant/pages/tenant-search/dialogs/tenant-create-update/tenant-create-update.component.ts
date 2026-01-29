import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  TenantCreateUpdateDialogResult,
  TenantCreateUpdateViewModel,
  TenantDialogMode
} from './tenant-create-update.types'
import { map } from 'rxjs'
import { FileSelectEvent } from 'primeng/fileupload'
import { ImagesAPIService } from 'src/app/shared/generated'
import { getImageUrl } from 'src/app/shared/utils/image.utils'

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
  @Input() public vm: TenantCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  @Input() public dialogMode: TenantDialogMode = TenantDialogMode.CREATE

  public formGroup!: FormGroup

  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  dialogResult: TenantCreateUpdateDialogResult | undefined = undefined
  dialogModeEnum = TenantDialogMode
  showImage = true

  private uploadedFile: File | null = null
  private baseImagePath: string

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImagesAPIService
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
      image: this.uploadedFile
    }
  }

  handleImageSelect(event: FileSelectEvent) {
    this.uploadedFile = event.files[0]
    if (this.formGroup.valid) {
      this.primaryButtonEnabled.next(true)
    }
  }

  handleFileRemove() {
    this.uploadedFile = null
  }

  handleLoadImageError() {
    this.showImage = false
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
    this.showImage = false
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
