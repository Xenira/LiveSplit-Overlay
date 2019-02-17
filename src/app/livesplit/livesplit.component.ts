import { Component, OnInit, ApplicationRef } from '@angular/core';
import { LivesplitService } from './shared/livesplit.service';
import Settings from '../settings';
import { ISplit } from '../models/split';
import { OverwolfService } from '../global/overwolf.service';
declare const overwolf;

@Component({
  selector: 'ls-livesplit',
  templateUrl: './livesplit.component.html',
  styleUrls: ['./livesplit.component.scss']
})
export class LivesplitComponent implements OnInit {

  util;
  connecting = false;
  connected = false;
  style = Settings.layout;
  public splits: ISplit[];

  layout = ['title', 'splits', 'timer'];

  constructor(private ref: ApplicationRef, public livesplit: LivesplitService, private _overwolf: OverwolfService) { }

  ngOnInit() {
    this.livesplit.onDisconnect.subscribe(() => {
      this.connected = false;
    });
    this.connect();
    this._overwolf.getPlugin('livesplit-util').then((util) => this.util = util);
    document.documentElement.style.backgroundColor = 'initial';
    document.documentElement.style.opacity = this.style.opacity.toString();
  }

  connect() {
    setTimeout(() => {
      this.connecting = true;
      this.ref.tick();
    });
    this.livesplit.connect().then(() => {
      this.connecting = false;
      this.connected = true;
      this.ref.tick();
    }).catch((ev) => {
      console.warn('Unable to connect:', ev);
      this.connecting = false;
      this.connected = false;
      this.ref.tick();
    });
  }

  startLiveSplit() {
    const livesplitDirectory = localStorage.getItem('livesplit.directory');
    this.util.startApplication(`${livesplitDirectory}/LiveSplit.exe`, (res) => {
      setTimeout(() => {
        this.ref.tick();
        console.log(res);
      }, 500);
    });
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

  openHelp() {
    this._overwolf.openHelp();
  }

}
