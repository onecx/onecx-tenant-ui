import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormBuilder, FormGroup } from '@angular/forms'
import { TenantCreateUpdateDialogResult, TenantCreateUpdateViewModel } from './tenant-create-update.types'
import { map } from 'rxjs'
import { FileSelectEvent } from 'primeng/fileupload'

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

  public formGroup!: FormGroup

  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  dialogResult: TenantCreateUpdateDialogResult | undefined = undefined

  private uploadedFile: File | null = null

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm()
    this.setUpdateMode()
    this.makeSubscriptions()
  }

  ocxDialogButtonClicked() {
    console.log(this.uploadedFile)
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

  private initForm() {
    this.formGroup = this.formBuilder.group({
      orgId: [null],
      description: [null],
      tenantId: [{ value: null, disabled: true }],
      modificationUser: [{ value: null, disabled: true }],
      modificationDate: [{ value: null, disabled: true }],
      creationUser: [{ value: null, disabled: true }],
      creationDate: [{ value: null, disabled: true }]
    })
  }

  private setUpdateMode() {
    if (this.vm.itemToEdit) {
      this.formGroup.patchValue({
        ...this.vm.itemToEdit
      })
    } else {
      this.formGroup.get('tenantId')!.enable({ emitEvent: false })
    }
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
