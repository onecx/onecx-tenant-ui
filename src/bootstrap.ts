import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { StandaloneWrapperModule } from './app/standalone.module'

platformBrowserDynamic()
  .bootstrapModule(StandaloneWrapperModule)
  .catch((err) => console.error(err))
