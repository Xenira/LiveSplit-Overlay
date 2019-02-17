import { Injectable } from '@angular/core';
import { LivesplitService, TimerPhase } from './livesplit.service';
import Settings from '../../settings';
import { ISplit } from 'src/app/models/split';

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

  private _splits: ISplit[];
  private _currentSplitIndex: number;

  constructor(private livesplit: LivesplitService) {
    try {
      this.attach();
    } catch {
      console.warn('Unable to attach to websocket. This might happen when not connected. You can most likely ignore this.');
    }
  }

  attach() {
    this.livesplit.onConnected.subscribe((connection) => {
      if (!connection) {
        console.warn('Not connectedl. Waiting for connection...');
      }

      connection.splitsCache.getValue().then((splits) => this._splits = splits);
      connection.onSplits.subscribe((splits) => this._splits = splits);

      connection.splitIndexCache.getValue().then((index) => this._currentSplitIndex = index);
      connection.onSplitIndex.subscribe((index) => this._currentSplitIndex = index);

      connection.currentTimeCache.getValue().then((time) => this.time = time);
      connection.onCurrentTime.subscribe((time) => this.time = time);

      connection.currentTimerPhaseCache.getValue().then((phase) => this._timerPhase = phase);
      connection.onCurrentTimerPhase.subscribe((phase) => this._timerPhase = phase);

      connection.comparisonSplitTimeCache.getValue().then((time) => this._splitTime = time);
      connection.onComparisonSplitTime.subscribe((time) => {
        this._splitTime = time;
        console.log(time);
      });
    });
  }

  getColor(delta?: number) {
    // console.log(this._timerPhase, this.time);
    switch (this._timerPhase) {
      case 'Running':
        const comparisonDelta = (delta || this.delta);
        const lastDelta = this.getSplitDelta(this._currentSplitIndex - 1);
        if (comparisonDelta < 0) {
          if (comparisonDelta > lastDelta) {
            return Settings.layout.colors.aheadLosing;
          }
          return Settings.layout.colors.aheadGaining;
        } else {
          if (comparisonDelta < lastDelta) {
            return Settings.layout.colors.behindGaining;
          }
          return Settings.layout.colors.behindLosing;
        }
      case 'NotRunning':
        return Settings.layout.colors.notRunning;
      case 'Paused':
        return Settings.layout.colors.paused;
      case 'Ended':
        if (this._splits[this._splits.length - 1].comparison > this.time) {
          return Settings.layout.colors.personalBest;
        }
        return Settings.layout.colors.behindLosing;
      default:
        return Settings.layout.colors.notRunning;
    }
  }

  getSplitColor(index: number) {
    const split = this._splits[index];
    const splitTime = this.getSplitTime(index);
    const splitDelta = this.getSplitDelta(index);
    const lastDelta = this.getSplitDelta(index - 1);

    if (splitTime < split.bestSegmentTime) {
      return Settings.layout.colors.bestSegment;
    }

    if (splitDelta < 0) {
      if (splitDelta > lastDelta) {
        return Settings.layout.colors.aheadLosing;
      }
      return Settings.layout.colors.aheadGaining;
    } else {
      if (splitDelta < lastDelta) {
        return Settings.layout.colors.behindGaining;
      }
      return Settings.layout.colors.behindLosing;
    }
  }

  /**
   * Returns the timedifference for a split compared to 'split' time
   * @param index Index of the split. Defaults to current split.
   */
  private getSplitTime(index?: number) {
    const comparisonIndex = index === null ? this._currentSplitIndex : index;
    if (comparisonIndex < 0 || !this._splits[comparisonIndex]) {
      return 0;
    }
    if (comparisonIndex === 0) {
      return this._splits[comparisonIndex].splitTime || 0;
    }

    const split = this._splits[comparisonIndex];
    const splitTime = split.splitTime || 0;
    let previousTime = 0;

    if (comparisonIndex > 0) {
      previousTime = this._splits[index - 1].splitTime || 0;
    }

    return splitTime - previousTime;
  }

  /**
   * Returns the delta (compared to 'global' time)
   * @param index Index of the split. Defaults to current split.
   */
  private getSplitDelta(index?: number) {
    const comparisonIndex = index === null ? this._currentSplitIndex : index;
    if (comparisonIndex < 0) {
      return 0;
    }
    if (comparisonIndex >= this._splits.length) {
      return this.getSplitDelta(this._splits.length - 1);
    }

    let delta = 0;
    const split = this._splits[comparisonIndex];
    if (split.splitTime && split.comparison) {
      delta = split.splitTime - split.comparison;
    } else if (index === this._currentSplitIndex) {
      delta = this.delta;
    }
    return delta;
  }

  private getSplit(index: number) {

  }

  private getTimerColor(currentDelta: number, lastDelta: number) {

  }
}
