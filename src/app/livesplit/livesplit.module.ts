import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';
import { LivesplitComponent } from './livesplit.component';
import { LayoutsModule } from './layouts/layouts.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControllsComponent } from './controlls/controlls.component';

@NgModule({
  declarations: [LivesplitComponent, ControllsComponent],
  imports: [
    CommonModule,
    GlobalModule,
    LayoutsModule,
    FontAwesomeModule
  ],
  exports: [LivesplitComponent],
  entryComponents: [LivesplitModule.rootComponent]
})
export class LivesplitModule {
  static rootComponent = LivesplitComponent;
}
