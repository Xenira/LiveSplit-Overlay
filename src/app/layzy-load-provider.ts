
import { InjectionToken } from '@angular/core';

// tslint:disable-next-line:interface-over-type-literal
export type LAZY_MODULES = {
    WelcomeWindow: string;
    LiveSplitWindow: string;
    HelpWindow: string;
};

export const lazyMap: LAZY_MODULES = {
    WelcomeWindow: 'src/app/welcome/welcome.module#WelcomeModule',
    LiveSplitWindow: 'src/app/livesplit/livesplit.module#LivesplitModule',
    HelpWindow: '/src/app/help/help.module#HelpModule',
};

export const LAZY_MODULES_MAP = new InjectionToken('LAZY_MODULES_MAP', {
    factory: () => lazyMap
});
