import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'

import { DockModule } from 'primeng/dock'
import { FileUploadModule } from 'primeng/fileupload'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { OrderListModule } from 'primeng/orderlist'
import { RadioButtonModule } from 'primeng/radiobutton'
import { SkeletonModule } from 'primeng/skeleton'
import { TabViewModule } from 'primeng/tabview'
import { TooltipModule } from 'primeng/tooltip'
import { ImageContainerComponent } from './components/image-container/image-container.component'
import { PortalCoreModule } from '@onecx/portal-integration-angular'

@NgModule({
  declarations: [ImageContainerComponent],
  imports: [
    PortalCoreModule.forMicroFrontend(),
    CommonModule,
    DockModule,
    FileUploadModule,
    FloatLabelModule,
    FormsModule,
    InputGroupModule,
    InputTextModule,
    InputTextareaModule,
    OrderListModule,
    RadioButtonModule,
    ReactiveFormsModule,
    SkeletonModule,
    TabViewModule,
    TooltipModule,
    TranslateModule
  ],
  exports: [
    DockModule,
    FileUploadModule,
    FloatLabelModule,
    FormsModule,
    InputGroupModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    ReactiveFormsModule,
    OrderListModule,
    SkeletonModule,
    TabViewModule,
    TooltipModule,
    TranslateModule,
    ImageContainerComponent
  ],
  providers: []
})
export class SharedModule {}
