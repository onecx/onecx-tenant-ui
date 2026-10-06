import { bootstrapModule } from '@onecx/angular-webcomponents'
import { environment } from 'src/environments/environment'
import { OneCXTenantModule } from './app/onecx-tenant.remote.module'

void bootstrapModule(OneCXTenantModule, 'microfrontend', environment.production)
