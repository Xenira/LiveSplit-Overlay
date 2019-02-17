import { Pipe, PipeTransform } from '@angular/core';

const msHours = 3600000;
const msMinutes = 60000;
const msSeconds = 1000;

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {
  transform(value: number, includePlus = false, alwaysShowMinutes = false, trimMs = 2): any {
    if (!value && value !== 0) {
      return;
    }

    let milliseconds = Math.abs(value);

    const hours = Math.floor(milliseconds / msHours);
    milliseconds -= hours * msHours;

    const minutes = Math.floor(milliseconds / msMinutes);
    milliseconds -= minutes * msMinutes;

    const seconds = Math.floor(milliseconds / msSeconds);
    milliseconds -= seconds * msSeconds;

    const sign = value < 0 ? '-' : (includePlus ? '+' : '');
    const h = hours !== 0 ? hours + ':' : '';
    let m = '';
    if (minutes || (minutes === 0 && alwaysShowMinutes) || hours) {
      m = ((hours && minutes < 10 && minutes !== 0) ? '0' + minutes : minutes) + ':';
    }
    const s = (minutes || seconds === 0 || alwaysShowMinutes) && (seconds < 10 && (seconds !== 0 || minutes)) ? '0' + seconds : seconds;
    const ms = minutes === 0 ? ('.' + milliseconds).substr(0, trimMs) : '';
    return sign + h + m + s + ms;
  }

}
