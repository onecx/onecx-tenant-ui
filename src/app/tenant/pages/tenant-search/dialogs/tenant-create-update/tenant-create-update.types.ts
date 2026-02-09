import { Tenant } from '../../../../../shared/generated'

export interface TenantCreateUpdateViewModel {
  itemToEdit: Tenant | undefined
}

export type TenantCreateUpdateDialogResult = Tenant & {
  image: File | null
  imageRemoved: boolean
}

export enum TenantDialogMode {
  DETAILS,
  CREATE,
  UPDATE
}
