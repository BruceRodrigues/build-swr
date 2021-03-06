import { dequal } from 'dequal/lite';
import { Configuration, RevalidatorOptions, Revalidator } from './types';
declare function onErrorRetry(_: unknown, __: string, config: Readonly<Required<Configuration>>, revalidate: Revalidator, opts: Required<RevalidatorOptions>): void;
declare const defaultConfig: {
    readonly isOnline: () => boolean;
    readonly isDocumentVisible: () => boolean;
    readonly registerOnFocus: (cb: () => void) => void;
    readonly registerOnReconnect: (cb: () => void) => void;
    readonly onLoadingSlow: () => void;
    readonly onSuccess: () => void;
    readonly onError: () => void;
    readonly onErrorRetry: typeof onErrorRetry;
    readonly revalidateOnFocus: true;
    readonly revalidateOnReconnect: true;
    readonly refreshWhenHidden: false;
    readonly refreshWhenOffline: false;
    readonly shouldRetryOnError: true;
    readonly suspense: false;
    readonly errorRetryInterval: 10000 | 5000;
    readonly focusThrottleInterval: number;
    readonly dedupingInterval: number;
    readonly loadingTimeout: 5000 | 3000;
    readonly refreshInterval: 0;
    readonly fetcher: (url: string) => Promise<any>;
    readonly compare: typeof dequal;
    readonly isPaused: () => boolean;
    readonly cache: import("./types").Cache<any>;
};
export default defaultConfig;
