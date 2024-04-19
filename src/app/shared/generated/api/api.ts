export * from './searchConfig.service';
import { SearchConfigBffService } from './searchConfig.service';
export * from './tenant.service';
import { TenantBffService } from './tenant.service';
export const APIS = [SearchConfigBffService, TenantBffService];
