import { TenantSearchCriteria as TenantSearchRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const tenantSearchCriteriasSchema = z.object({
  orgId: z.string().optional(),
  pageNumber: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  pageSize: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .optional(),
  id: z.string().optional()
} satisfies Partial<Record<keyof TenantSearchRequest, ZodTypeAny>>)

export type TenantSearchCriteria = z.infer<typeof tenantSearchCriteriasSchema>
