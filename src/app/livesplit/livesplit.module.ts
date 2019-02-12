import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';
import { OverlayComponent } from './overlay.component';
import { LayoutsModule } from './layouts/layouts.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [OverlayComponent],
  imports: [
    CommonModule,
    GlobalModule,
    LayoutsModule,
    FontAwesomeModule
  ],
  exports: [OverlayComponent]
})
export class LivesplitModule { }
