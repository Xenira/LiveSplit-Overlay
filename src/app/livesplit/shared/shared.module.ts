import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerService } from './timer.service';

const services = [TimerService];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
