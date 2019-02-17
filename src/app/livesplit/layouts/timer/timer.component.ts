import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { TimerPhase } from 'src/app/livesplit/shared/livesplit.service';
import { DomSanitizer } from '@angular/platform-browser';
import Settings from 'src/app/settings';
import { TimerService } from '../../shared/timer.service';

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

  constructor(private ref: ApplicationRef, public timer: TimerService) { }

  ngOnInit() {
    setInterval(() => {
      this.time = this.timer.time;
      const ms = (this.time % 1000);
      this.milliseconds = (ms < 10 ? '00' : (ms < 100 ? '0' + ms : ms.toString())).substr(0, 2);
      try {
        this.color = this.timer.getColor();
      } catch { }
      this.ref.tick();
    }, 13);
  }
}
