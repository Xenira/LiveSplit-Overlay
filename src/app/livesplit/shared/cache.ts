import { Promise } from 'q';
import { Subject } from 'rxjs';

export class Cache<T> {
    private intervall;
    private value: T;
    private lastUpdate = 0;
    private promise: Promise<T>;
    private resolve: (result: T) => any;
    private reject: (reason: any) => any;

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
                this.reject = null;
            }
        });
    }

    clear() {
        clearInterval(this.intervall);
        this.newDataEvent.complete();
        if (this.promise && this.reject) {
            this.reject(new Error('Connection closed'));
        }
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
            this.reject = reject;
            setTimeout(() => {
                if (this.promise) {
                    reject(new Error('Timeout reached'));
                }
            }, 1000);
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
