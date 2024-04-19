import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TenantBffService, TenantSearchResponse } from '../generated';

@Injectable()
export class TenantService {
  constructor(private tenantAPIService: TenantBffService) {}

  search(searchString: string): Observable<TenantSearchResponse> {
    return this.tenantAPIService.searchTenants({
      orgId: searchString,
      pageNumber: 1,
      pageSize: 10,
    });
  }
}