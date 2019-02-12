import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RgbaHexPipe } from './rgba-hex.pipe';
import { ButtonComponent } from './button/button.component';

const declarations = [RgbaHexPipe, ButtonComponent];

@NgModule({
  declarations,
  imports: [
    CommonModule
  ],
  exports: declarations,
})
export class GlobalModule { }
