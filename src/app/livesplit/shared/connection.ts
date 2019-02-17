import { Subject } from 'rxjs';

import { Cache } from './cache';
import { ISplit } from 'src/app/models/split';
import { TimerPhase } from './livesplit.service';
import { IGameData } from 'src/app/models/game-data';

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;

export class Connection {
    public onStart = new Subject<void>();
    public onPause = new Subject<void>();
    public onResume = new Subject<void>();
    public onReset = new Subject<void>();
    public onSplit = new Subject<void>();

    public onCurrentTime = new Subject<number>();
    public currentTimeCache = new Cache(() => this.client.send('getcurrenttime'), this.onCurrentTime, 2 * minute);

    public onSplits = new Subject<ISplit[]>();
    public splitsCache = new Cache(() => this.client.send('getsplits'), this.onSplits, 10 * minute);

    public onCurrentTimerPhase = new Subject<TimerPhase>();
    public currentTimerPhaseCache = new Cache(() => this.client.send('getcurrenttimerphase'), this.onCurrentTimerPhase, 10 * minute);

    public onGame = new Subject<IGameData>();
    public gameCache = new Cache(() => this.client.send('getGame'), this.onGame, hour, false);

    public onSplitIndex = new Subject<number>();
    public splitIndexCache = new Cache(() => this.client.send('getsplitindex'), this.onSplitIndex, 60000, false);

    public onDelta = new Subject<number>();
    public deltaCache = new Cache(() => this.client.send('getdelta'), this.onDelta, 10000, false);

    public onComparisonSplitTime = new Subject<number>();
    public comparisonSplitTimeCache = new Cache(() => this.client.send('getcomparisonsplittime'), this.onComparisonSplitTime, 10 * minute);

    private caches = [
        this.currentTimeCache,
        this.splitsCache,
        this.currentTimerPhaseCache,
        this.gameCache,
        this.splitIndexCache,
        this.deltaCache,
        this.comparisonSplitTimeCache
    ];

    constructor(public client: WebSocket) { }

    send(data: string) {
        if (!this.client.OPEN) {
            throw new Error('Connection not open');
        }
        this.client.send(data);
    }

    close() {
        this.caches.forEach((cache) => {
            cache.clear();
        });
    }
}
