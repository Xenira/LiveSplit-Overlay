import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpComponent } from './help.component';
import { FaqComponent } from './faq/faq.component';
import { GlobalModule } from '../global/global.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComments, faBug, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [HelpComponent, FaqComponent],
  imports: [
    CommonModule,
    GlobalModule,
    FontAwesomeModule
  ],
  entryComponents: [HelpModule.rootComponent]
})
export class HelpModule {
  static rootComponent = HelpComponent;
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faComments, faBug, faPuzzlePiece);
  }
}
