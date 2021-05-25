var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { dequal } from 'dequal/lite';
import { wrapCache } from './cache';
import webPreset from './libs/web-preset';
import { slowConnection } from './env';
var fetcher = function (url) { return fetch(url).then(function (res) { return res.json(); }); };
var noop = function () { };
// error retry
function onErrorRetry(_, __, config, revalidate, opts) {
    if (!webPreset.isDocumentVisible()) {
        // if it's hidden, stop
        // it will auto revalidate when focus
        return;
    }
    if (typeof config.errorRetryCount === 'number' &&
        opts.retryCount > config.errorRetryCount) {
        return;
    }
    // exponential backoff
    var count = Math.min(opts.retryCount, 8);
    var timeout = ~~((Math.random() + 0.5) * (1 << count)) * config.errorRetryInterval;
    setTimeout(revalidate, timeout, opts);
}
// config
var defaultConfig = __assign({ 
    // events
    onLoadingSlow: noop, onSuccess: noop, onError: noop, onErrorRetry: onErrorRetry, 
    // switches
    revalidateOnFocus: true, revalidateOnReconnect: true, refreshWhenHidden: false, refreshWhenOffline: false, shouldRetryOnError: true, suspense: false, 
    // timeouts
    errorRetryInterval: slowConnection ? 10000 : 5000, focusThrottleInterval: 5 * 1000, dedupingInterval: 2 * 1000, loadingTimeout: slowConnection ? 5000 : 3000, refreshInterval: 0, 
    // providers
    fetcher: fetcher, compare: dequal, isPaused: function () { return false; }, cache: wrapCache(new Map()) }, webPreset);
export default defaultConfig;
