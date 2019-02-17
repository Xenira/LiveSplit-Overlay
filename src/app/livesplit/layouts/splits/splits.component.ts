import { Component, OnInit, OnDestroy } from '@angular/core';
import { LivesplitService, TimerPhase } from 'src/app/livesplit/shared/livesplit.service';
import { ISplit } from 'src/app/models/split';
import Settings from 'src/app/settings';
import { TimerService } from '../../shared/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ls-splits',
  templateUrl: './splits.component.html',
  styleUrls: ['./splits.component.scss']
})
export class SplitsComponent implements OnInit, OnDestroy {

  layout = Settings.layout;
  splits: ISplit[];
  currentSplit: number;
  currentDelta: number;
  timerPhase: TimerPhase;
  subscriptions: Subscription[] = [];

  constructor(private livesplit: LivesplitService, public timer: TimerService) { }

  ngOnInit() {
    this.livesplit.onConnected.subscribe((connection) => {
      if (!connection) {
        console.warn('Not connectedl. Waiting for connection...');
      }
      this.ngOnDestroy();

      connection.splitsCache.getValue().then((splits) => this.splits = splits);
      this.subscriptions.push(connection.onSplits.subscribe((splits) => this.splits = splits));

      connection.splitIndexCache.getValue().then((index) => this.currentSplit = index);
      this.subscriptions.push(connection.onSplitIndex.subscribe((index) => this.currentSplit = index));

      connection.currentTimerPhaseCache.getValue().then((phase) => this.timerPhase = phase);
      this.subscriptions.push(connection.onCurrentTimerPhase.subscribe((phase) => this.timerPhase = phase));
    });

    setInterval(() => {
      this.currentDelta = this.timer.delta;
    }, 13);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  time(split: ISplit) {
    return (split.splitTime || split.comparison);
  }

  getSplitBackground = (index: number) => {
    if (index === this.currentSplit) {
      return Settings.splits.currentSplitBackground.color1;
    }
    return index % 2 ? Settings.splits.background.color2 : Settings.splits.background.color1;
  }

  diff(split: ISplit) {
    if (split.splitTime) {
      return split.splitTime - split.comparison;
    }
    return null;
  }

  splitDiff() {
    if (this.currentSplit > 0 || this.currentDelta > 0) {
      const delta = this.currentDelta;
      const prevSplit = this.currentSplit === 0 ? this.splits[this.currentSplit].comparison : this.diff(this.splits[this.currentSplit - 1]);
      return (delta > 0 || delta > prevSplit) ? delta : null;
    }
    return null;
  }
}
