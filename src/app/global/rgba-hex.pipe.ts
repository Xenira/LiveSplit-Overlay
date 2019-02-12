import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rgbaHex'
})
export class RgbaHexPipe implements PipeTransform {

  transform(hex: string, args?: any): any {
    hex = hex.substring(1);
    while (hex.length < 8) {
      hex = '0' + hex;
    }
    const a = 1 / 255 * parseInt(hex.substr(0, 2), 16);
    const r = parseInt(hex.substr(2, 2), 16);
    const g = parseInt(hex.substr(4, 2), 16);
    const b = parseInt(hex.substr(6, 2), 16);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

}
