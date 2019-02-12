import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { LandingComponent } from './landing/landing.component';
import { SetupComponent } from './setup/setup.component';
import { FinishedComponent } from './finished/finished.component';
import { GlobalModule } from '../global/global.module';

@NgModule({
  declarations: [WelcomeComponent, LandingComponent, SetupComponent, FinishedComponent],
  imports: [
    CommonModule,
    GlobalModule
  ],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
