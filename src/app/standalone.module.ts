import { NgModule } from '@angular/core'

import { ShellCoreModule } from '@onecx/shell-core'
import { provideStandaloneProviders } from '@onecx/standalone-shell'
import { AppComponent } from './app.component'
import { AppModule } from './app.module'

@NgModule({
  imports: [AppModule, ShellCoreModule],
  exports: [AppModule],
  providers: [provideStandaloneProviders()],
  bootstrap: [AppComponent]
})
export class StandaloneWrapperModule {}
