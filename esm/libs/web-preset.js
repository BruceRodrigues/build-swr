import { isUndefined } from './helper';
/**
 * Due to bug https://bugs.chromium.org/p/chromium/issues/detail?id=678075,
 * it's not reliable to detect if the browser is currently online or offline
 * based on `navigator.onLine`.
 * As a work around, we always assume it's online on first load, and change
 * the status upon `online` or `offline` events.
 */
var online = true;
var isOnline = function () { return online; };
// For node and React Native, `window.addEventListener` doesn't exist.
var addWindowEventListener = typeof window !== 'undefined' ? window.addEventListener.bind(window) : null;
var addDocumentEventListener = typeof document !== 'undefined'
    ? document.addEventListener.bind(document)
    : null;
var isDocumentVisible = function () {
    if (addDocumentEventListener) {
        var visibilityState = document.visibilityState;
        if (!isUndefined(visibilityState)) {
            return visibilityState !== 'hidden';
        }
    }
    // always assume it's visible
    return true;
};
var registerOnFocus = function (cb) {
    if (addWindowEventListener && addDocumentEventListener) {
        // focus revalidate
        addDocumentEventListener('visibilitychange', function () { return cb(); });
        addWindowEventListener('focus', function () { return cb(); });
    }
};
var registerOnReconnect = function (cb) {
    if (addWindowEventListener) {
        // reconnect revalidate
        addWindowEventListener('online', function () {
            online = true;
            cb();
        });
        // nothing to revalidate, just update the status
        addWindowEventListener('offline', function () { return (online = false); });
    }
};
export default {
    isOnline: isOnline,
    isDocumentVisible: isDocumentVisible,
    registerOnFocus: registerOnFocus,
    registerOnReconnect: registerOnReconnect
};
