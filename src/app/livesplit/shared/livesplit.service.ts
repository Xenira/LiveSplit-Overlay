import { Injectable } from '@angular/core';
import * as moment from 'moment';

// tslint:disable-next-line:no-unused-expression
declare const overwolf;
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;

import { ISplit } from '../../models/split';
import { Promise } from 'q';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import Settings from '../../settings';
import { IGameData } from '../../models/game-data';

export declare type TimerPhase = 'NotRunning' | 'Paused' | 'Running';

@Injectable({
  providedIn: 'root'
})
export class LivesplitService {

  constructor() {
    this.client = new WebSocket(`ws://localhost:16835/livesplit`);
    this.client.onopen = () => {
      console.log('Connected', this.client.readyState);
      this.registerEvents();
    };
    this.client.onmessage = (msg) => {
      console.log('message: ' + msg.data);
      const event = JSON.parse(msg.data);

      switch (event.name) {
        case 'start':
          this.currentTimerPhaseCache.setValue('Running');
          this.currentTimeCache.setValue(0);
          this.splitIndexCache.setValue(0);
          this.gameCache.getValue(true);
          this.comparisonSplitTime.getValue(true);
          this.onStart.next();
          break;
        case 'pause':
          this.currentTimeCache.getValue(true);
          this.currentTimerPhaseCache.setValue('Paused');
          this.onPause.next();
          break;
        case 'resume':
          this.currentTimeCache.getValue(true)
            .then(() => this.currentTimerPhaseCache.setValue('Running'));
          this.onResume.next();
          break;
        case 'reset':
          this.splitsCache.getValue(true);
          this.splitIndexCache.setValue(-1);
          this.currentTimeCache.setValue(0);
          this.currentTimerPhaseCache.setValue('NotRunning');
          this.onReset.next();
          break;
        case 'split':
          this.splitsCache.getValue(true);
          this.comparisonSplitTime.getValue(true);
          this.splitIndexCache.getValue(true);
          this.onSplit.next();
          break;
        case 'getcurrenttime':
          const time = event.data.length <= 8 ? '00:' + event.data : event.data;
          this.onCurrentTime.next(time);
          break;
        case 'getsplits':
          this.onSplits.next(event.data);
          break;
        case 'getsplitindex':
          this.onSplitIndex.next(event.data);
          break;
        case 'getcurrenttimerphase':
          this.onCurrentTimperPhase.next(event.data);
          break;
        case 'getGame':
          this.onGame.next(event.data);
          break;
        case 'getdelta':
          this.onDelta.next(event.data);
          break;
        case 'getcomparisonsplittime':
          console.log(event.data, moment.duration(event.data));
          this.onComparisonSplitTime.next(event.data);
          break;
      }
    };
  }

  client: WebSocket;

  public onStart = new Subject<void>();
  public onPause = new Subject<void>();
  public onResume = new Subject<void>();
  public onReset = new Subject<void>();
  public onSplit = new Subject<void>();

  public onCurrentTime = new Subject<number>();
  public currentTimeCache = new Cache(() => this.client.send('getcurrenttime'), this.onCurrentTime, 2 * minute);

  public onSplits = new Subject<ISplit[]>();
  public splitsCache = new Cache(() => this.client.send('getsplits'), this.onSplits, 10 * minute);

  public onCurrentTimperPhase = new Subject<TimerPhase>();
  public currentTimerPhaseCache = new Cache(() => this.client.send('getcurrenttimerphase'), this.onCurrentTimperPhase, 10 * minute);

  public onGame = new Subject<IGameData>();
  public gameCache = new Cache(() => this.client.send('getGame'), this.onGame, hour, false);

  public onSplitIndex = new Subject<number>();
  public splitIndexCache = new Cache(() => this.client.send('getsplitindex'), this.onSplitIndex, 60000, false);

  public onDelta = new Subject<number>();
  public deltaCache = new Cache(() => this.client.send('getdelta'), this.onDelta, 10000, false);

  public onComparisonSplitTime = new Subject<number>();
  public comparisonSplitTime = new Cache(() => this.client.send('getcomparisonsplittime'), this.onComparisonSplitTime, 10 * minute);

  registerEvents() {
    this.client.send('registerEvent start pause resume reset split');
  }

  startTimer() {
    this.client.send('starttimer');
  }
}

class Cache<T> {
  private intervall;
  private value: T;
  private lastUpdate = 0;
  private promise: Promise<T>;
  private resolve: (result: T) => any;

  constructor(private refreshMethod: () => any, private newDataEvent: Subject<T>, private ttl: number, private refresh = true) {
    if (refresh) {
      this.intervall = setInterval(() => refreshMethod(), ttl);
    }

    this.newDataEvent.subscribe((data) => {
      this.value = data;
      this.lastUpdate = new Date().getTime();
      if (this.promise) {
        this.resolve(this.value);
        this.promise = null;
        this.resolve = null;
      }
    });
  }

  setTtl(ttl: number) {
    this.ttl = ttl;
    if (this.intervall) {
      clearInterval(this.intervall);
      this.intervall = null;
    }
    if (this.refresh) {
      this.intervall = setInterval(() => this.refreshMethod(), this.ttl);
    }
  }

  getValue(force = false): Promise<T> {
    if (this.lastUpdate + this.ttl > new Date().getTime() && !force) {
      return Promise((resolve) => resolve(this.value));
    }
    if (this.promise) {
      return this.promise;
    }
    this.promise = Promise((resolve, reject) => {
      this.resolve = resolve;
      this.refreshMethod();
    });
    return this.promise;
  }

  setValue(value: T, extendTime = true) {
    this.value = value;
    if (extendTime) {
      this.lastUpdate = new Date().getTime();
    }
    this.newDataEvent.next(this.value);
  }
}
