import { Component, OnInit } from '@angular/core';
import { LivesplitService } from './livesplit/shared/livesplit.service';
import Settings from './settings';
import { OverwolfService } from './global/overwolf.service';

@Component({
  selector: 'ls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public target = 'loading';
  layout = Settings.layout;

  constructor(private _overwolf: OverwolfService) { }

  ngOnInit(): void {
    this._overwolf.getCurrentWindow().then((window) => this.target = window.name);
  }
}
