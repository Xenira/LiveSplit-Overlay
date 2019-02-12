import { Component, OnInit } from '@angular/core';
import { LivesplitService } from './shared/livesplit.service';
import Settings from '../settings';
import { ISplit } from '../models/split';
declare const overwolf;

@Component({
  selector: 'ls-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  // icons

  connected = false;
  style = Settings.layout;
  public splits: ISplit[];

  layout = ['title', 'splits', 'timer'];

  constructor(public livesplit: LivesplitService) { }

  ngOnInit() {
  }

  connect() {
    this.connected = true;
  }

  dragResize(event) {
    console.log(event);
    overwolf.windows.getCurrentWindow((result) => {
      if (result.status === 'success') {
        overwolf.windows.dragResize(result.window.id, 'BottomRight');
      }
    });
  }

  dragMove() {
    overwolf.windows.getCurrentWindow((result) => {
      if (result.status === 'success') {
        overwolf.windows.dragMove(result.window.id);
      }
    });
  }

}
