export * from './images.service';
import { ImagesAPIService } from './images.service';
export * from './tenant.service';
import { TenantAPIService } from './tenant.service';
export const APIS = [ImagesAPIService, TenantAPIService];
