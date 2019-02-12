import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title/title.component';
import { SplitsComponent } from './splits/splits.component';
import { TimerComponent } from './timer/timer.component';
import { TimerPipe } from './timer.pipe';
import { SharedModule } from '../shared/shared.module';
import { GlobalModule } from 'src/app/global/global.module';

const layouts = [TitleComponent, SplitsComponent, TimerComponent, TimerPipe];

@NgModule({
  declarations: layouts,
  imports: [
    CommonModule,
    SharedModule,
    GlobalModule,
  ],
  exports: layouts
})
export class LayoutsModule { }
