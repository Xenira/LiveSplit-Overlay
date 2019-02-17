import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamation, faQuestionCircle, faGraduationCap, faCode, faGlobe, } from '@fortawesome/free-solid-svg-icons';
import { GlobalModule } from './global/global.module';
import { LoadModuleDirective } from './load-module.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoadModuleDirective,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    GlobalModule,
  ],
  providers: [{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faExclamation, faQuestionCircle, faGraduationCap, faCode, faGlobe);
  }
}
