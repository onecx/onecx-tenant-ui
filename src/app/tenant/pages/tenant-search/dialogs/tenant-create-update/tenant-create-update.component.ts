import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormBuilder, FormGroup } from '@angular/forms'
import { TenantCreateUpdateViewModel } from './tenant-create-update.viewmodel'
import { Tenant } from 'src/app/shared/generated'
import { map } from 'rxjs'

@Component({
  selector: 'app-tenant-create-update',
  templateUrl: './tenant-create-update.component.html',
  styleUrls: ['./tenant-create-update.component.scss']
})
export class TenantCreateUpdateComponent
  implements
    DialogPrimaryButtonDisabled,
    DialogResult<Tenant | undefined>,
    DialogButtonClicked<TenantCreateUpdateComponent>,
    OnInit
{
  @Input() public vm: TenantCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  public formGroup!: FormGroup

  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  dialogResult: Tenant | undefined = undefined

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm()
    this.setUpdateMode()
    this.makeSubscriptions()
  }

  ocxDialogButtonClicked() {
    this.dialogResult = {
      ...this.vm.itemToEdit,
      ...this.formGroup.value
    }
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
