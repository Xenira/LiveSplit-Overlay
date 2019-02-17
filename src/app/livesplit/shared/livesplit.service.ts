import { Injectable } from '@angular/core';
import { Promise } from 'q';
import { Subject, BehaviorSubject } from 'rxjs';

import { Connection } from './connection';

export declare type TimerPhase = 'NotRunning' | 'Paused' | 'Running' | 'Ended';

@Injectable({
  providedIn: 'root'
})
export class LivesplitService {

  public onDisconnect = new Subject<CloseEvent>();
  public onConnected = new BehaviorSubject<Connection>(null);

  constructor() {
  }

  connection: Connection;

  connect(): Promise<Connection> {
    return Promise((resolve, reject) => {
      const client = new WebSocket(`ws://localhost:16835/livesplit`);
      client.onopen = () => {
        this.connection = new Connection(client);
        this.registerEvents();
        this.onConnected.next(this.connection);
        resolve(this.connection);
      };
      client.onmessage = (msg) => this.handleEvent(msg);
      client.onclose = (ev) => {
        console.log('Closing');
        if (this.connection) {
          this.connection.close();
          this.connection = null;
        }
        this.onDisconnect.next(ev);
        reject(ev);
      };
    });
  }

  registerEvents() {
    this.connection.send('registerEvent start pause resume reset split');
  }

  startTimer() {
    this.connection.send('starttimer');
  }

  handleEvent(msg: MessageEvent) {
    const event = JSON.parse(msg.data);

    switch (event.name) {
      case 'start':
        this.connection.currentTimerPhaseCache.setValue('Running');
        this.connection.currentTimeCache.setValue(0);
        this.connection.splitIndexCache.setValue(0);
        this.connection.gameCache.getValue(true);
        this.connection.splitsCache.getValue(true);
        this.connection.comparisonSplitTimeCache.getValue(true);
        this.connection.onStart.next();
        break;
      case 'pause':
        this.connection.currentTimeCache.getValue(true);
        this.connection.currentTimerPhaseCache.setValue('Paused');
        this.connection.onPause.next();
        break;
      case 'resume':
        this.connection.currentTimeCache.getValue(true)
          .then(() => this.connection.currentTimerPhaseCache.setValue('Running'));
        this.connection.onResume.next();
        break;
      case 'reset':
        this.connection.splitsCache.getValue(true);
        this.connection.splitIndexCache.setValue(-1);
        this.connection.currentTimeCache.setValue(0);
        this.connection.currentTimerPhaseCache.setValue('NotRunning');
        this.connection.onReset.next();
        break;
      case 'split':
        this.connection.splitsCache.getValue(true);
        this.connection.comparisonSplitTimeCache.getValue(true);
        this.connection.splitIndexCache.getValue(true);
        this.connection.currentTimeCache.getValue(true);
        this.connection.currentTimerPhaseCache.getValue(true);
        this.connection.onSplit.next();
        break;
      case 'getcurrenttime':
        const time = event.data.length <= 8 ? '00:' + event.data : event.data;
        this.connection.onCurrentTime.next(time);
        break;
      case 'getsplits':
        this.connection.onSplits.next(event.data);
        break;
      case 'getsplitindex':
        this.connection.onSplitIndex.next(event.data);
        break;
      case 'getcurrenttimerphase':
        this.connection.onCurrentTimerPhase.next(event.data);
        break;
      case 'getGame':
        this.connection.onGame.next(event.data);
        break;
      case 'getdelta':
        this.connection.onDelta.next(event.data);
        break;
      case 'getcomparisonsplittime':
        this.connection.onComparisonSplitTime.next(event.data);
        break;
    }
  }
}
