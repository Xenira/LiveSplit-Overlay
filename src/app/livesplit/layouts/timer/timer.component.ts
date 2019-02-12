import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TimerPhase } from 'src/app/livesplit/shared/livesplit.service';
import { DomSanitizer } from '@angular/platform-browser';
import Settings from 'src/app/settings';
import { TimerService } from '../../shared/timer.service';
import { duration } from 'moment';

@Component({
  selector: 'ls-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'], changeDetection: ChangeDetectionStrategy.Default
})
export class TimerComponent implements OnInit {

  public textBackground = Settings.layout.colors.paused;

  public currentPhase: TimerPhase;
  public milliseconds: string;
  public time: number;
  public color: string;

  constructor(private _sanitizer: DomSanitizer, public timer: TimerService) {
  }

  ngOnInit() {
    setInterval(() => {
      this.time = this.timer.time;
      const ms = duration(this.time).milliseconds();
      this.milliseconds = ((ms < 10 ? '0' : '') + ms).substr(0, 2);
      this.color = this.timer.getColor();
    }, 13);
  }
}
