import { Component, OnInit } from '@angular/core';
import { LivesplitService, TimerPhase } from 'src/app/livesplit/shared/livesplit.service';
import { ISplit } from 'src/app/models/split';
import Settings from 'src/app/settings';
import { TimerService } from '../../shared/timer.service';

@Component({
  selector: 'ls-splits',
  templateUrl: './splits.component.html',
  styleUrls: ['./splits.component.scss']
})
export class SplitsComponent implements OnInit {

  layout = Settings.layout;
  splits: ISplit[];
  currentSplit: number;
  currentDelta: number;
  timerPhase: TimerPhase;


  constructor(private livesplit: LivesplitService, private timer: TimerService) { }

  ngOnInit() {
    this.livesplit.splitsCache.getValue().then((splits) => this.splits = splits);
    this.livesplit.onSplits.subscribe((splits) => this.splits = splits);

    this.livesplit.splitIndexCache.getValue().then((index) => this.currentSplit = index);
    this.livesplit.onSplitIndex.subscribe((index) => this.currentSplit = index);

    this.livesplit.currentTimerPhaseCache.getValue().then((phase) => this.timerPhase = phase);
    this.livesplit.onCurrentTimperPhase.subscribe((phase) => this.timerPhase = phase);

    setInterval(() => {
      this.currentDelta = this.timer.delta;
    });
  }

  time(split: ISplit) {
    return (split.splitTime || split.comparison);
  }

  getSplitBackground = (index: number) => {
    if (index === this.currentSplit) {
      return Settings.splits.currentSplitBackground.color1;
    }
    return index % 2 ? Settings.splits.background.color1 : Settings.splits.background.color2;
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

  getColor(index: number) {
    const split = this.splits[index];
    let delta = 0;
    let time = 0;
    if (split.splitTime && split.comparison) {
      delta = split.splitTime - split.comparison;
      time = split.splitTime;
    } else if (index === this.currentSplit) {
      delta = this.currentDelta;
      time = delta;
    }
    if (delta === 0) {
      return Settings.layout.colors.text;
    }
    if (delta < 0) {
      if (time > split.bestSegmentTime && time < split.personalBestSplitTime) {
        return Settings.layout.colors.bestSegment;
      }
      if (time < split.personalBestSplitTime) {
        return Settings.layout.colors.personalBest;
      }
      return Settings.layout.colors.aheadGaining;
    }
    return Settings.layout.colors.behindLosing;
  }

}
