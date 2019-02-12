import { Injectable } from '@angular/core';
import { Duration, duration } from 'moment';
import { LivesplitService, TimerPhase } from './livesplit.service';
import Settings from '../../settings';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  get time() {
    if (!this._time && this._time !== 0) {
      return 0;
    }
    if (this._timerPhase !== 'Running') {
      return this._time;
    }
    return this._time + (new Date().getTime() - this._lastSync);
  }
  set time(time: number) {
    this._lastSync = new Date().getTime();
    this._time = time;
  }

  get delta() {
    if (this.time && this._splitTime) {
      return this.time - this._splitTime;
    }
    return 0;
  }

  private _time: number;
  private _lastSync: number;

  private _timerPhase: TimerPhase;
  private _splitTime: number;

  constructor(livesplit: LivesplitService) {
    livesplit.currentTimeCache.getValue().then((time) => this.time = time);
    livesplit.onCurrentTime.subscribe((time) => this.time = time);

    livesplit.currentTimerPhaseCache.getValue().then((phase) => this._timerPhase = phase);
    livesplit.onCurrentTimperPhase.subscribe((phase) => this._timerPhase = phase);

    livesplit.comparisonSplitTime.getValue().then((time) => this._splitTime = time);
    livesplit.onComparisonSplitTime.subscribe((time) => {
      this._splitTime = time;
      console.log(time);
    });
  }

  getColor(delta?: number) {
    switch (this._timerPhase) {
      case 'Running':
        return (delta || this.delta) < 0 ? Settings.layout.colors.aheadGaining : Settings.layout.colors.behindLosing;
      case 'NotRunning':
        return Settings.layout.colors.notRunning;
      case 'Paused':
        return Settings.layout.colors.paused;
      default:
        return Settings.layout.colors.notRunning;
    }
  }
}
