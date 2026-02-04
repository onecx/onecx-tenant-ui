import { Tenant } from '../../../../../shared/generated'

export interface TenantCreateUpdateViewModel {
  itemToEdit: Tenant | undefined
}

export type TenantCreateUpdateDialogResult = Tenant & {
  image: File | null
}

export enum TenantDialogMode {
  DETAILS,
  CREATE,
  UPDATE
}
