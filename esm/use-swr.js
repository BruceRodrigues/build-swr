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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// TODO: use @ts-expect-error
import { useCallback, useRef, useDebugValue } from 'react';
import defaultConfig from './config';
import { wrapCache } from './cache';
import { IS_SERVER, rAF, useIsomorphicLayoutEffect } from './env';
import { serialize } from './libs/serialize';
import { isUndefined, UNDEFINED } from './libs/helper';
import SWRConfigContext from './config-context';
import useStateWithDeps from './state';
import useArgs from './resolve-args';
// Generate strictly increasing timestamps.
var __timestamp = 0;
var now = function () { return ++__timestamp; };
// Global state used to deduplicate requests and store listeners
var SWRGlobalState = new WeakMap();
var getGlobalState = function (cache) {
    if (!SWRGlobalState.has(cache)) {
        SWRGlobalState.set(cache, [{}, {}, {}, {}, {}, {}, {}]);
    }
    return SWRGlobalState.get(cache);
};
// Setup DOM events listeners for `focus` and `reconnect` actions
if (!IS_SERVER) {
    var _a = getGlobalState(defaultConfig.cache), FOCUS_REVALIDATORS_1 = _a[0], RECONNECT_REVALIDATORS_1 = _a[1];
    var revalidate_1 = function (revalidators) {
        if (!defaultConfig.isDocumentVisible() || !defaultConfig.isOnline())
            return;
        for (var key in revalidators) {
            if (revalidators[key][0])
                revalidators[key][0]();
        }
    };
    defaultConfig.registerOnFocus(function () { return revalidate_1(FOCUS_REVALIDATORS_1); });
    defaultConfig.registerOnReconnect(function () { return revalidate_1(RECONNECT_REVALIDATORS_1); });
}
var broadcastState = function (cache, key, data, error, isValidating, shouldRevalidate) {
    if (shouldRevalidate === void 0) { shouldRevalidate = false; }
    var _a = getGlobalState(cache), CACHE_REVALIDATORS = _a[2];
    var updaters = CACHE_REVALIDATORS[key];
    var promises = [];
    if (updaters) {
        for (var i = 0; i < updaters.length; ++i) {
            promises.push(updaters[i](shouldRevalidate, data, error, isValidating, i > 0));
        }
    }
    return Promise.all(promises).then(function () { return cache.get(key); });
};
function internalMutate(cache, _key, _data, shouldRevalidate) {
    if (shouldRevalidate === void 0) { shouldRevalidate = true; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, key, keyErr, _b, MUTATION_TS, MUTATION_END_TS, beforeMutationTs, data, error, isAsyncMutation, err_1, shouldAbort;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = serialize(_key), key = _a[0], keyErr = _a[2];
                    if (!key)
                        return [2 /*return*/, UNDEFINED];
                    _b = getGlobalState(cache), MUTATION_TS = _b[3], MUTATION_END_TS = _b[4];
                    // if there is no new data to update, let's just revalidate the key
                    if (isUndefined(_data)) {
                        return [2 /*return*/, broadcastState(cache, key, cache.get(key), cache.get(keyErr), UNDEFINED, shouldRevalidate)];
                    }
                    // update global timestamps
                    MUTATION_TS[key] = now();
                    MUTATION_END_TS[key] = 0;
                    beforeMutationTs = MUTATION_TS[key];
                    isAsyncMutation = false;
                    if (typeof _data === 'function') {
                        // `_data` is a function, call it passing current cache value
                        try {
                            _data = _data(cache.get(key));
                        }
                        catch (err) {
                            // if `_data` function throws an error synchronously, it shouldn't be cached
                            _data = UNDEFINED;
                            error = err;
                        }
                    }
                    if (!(_data && typeof _data.then === 'function')) return [3 /*break*/, 5];
                    // `_data` is a promise
                    isAsyncMutation = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _data];
                case 2:
                    data = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    data = _data;
                    _c.label = 6;
                case 6:
                    shouldAbort = function () {
                        // check if other mutations have occurred since we've started this mutation
                        if (beforeMutationTs !== MUTATION_TS[key]) {
                            if (error)
                                throw error;
                            return true;
                        }
                    };
                    // If there's a race we don't update cache or broadcast change, just return the data
                    if (shouldAbort())
                        return [2 /*return*/, data];
                    if (!isUndefined(data)) {
                        // update cached data
                        cache.set(key, data);
                    }
                    // Always update or reset the error
                    cache.set(keyErr, error);
                    // Reset the timestamp to mark the mutation has ended
                    MUTATION_END_TS[key] = now();
                    if (!isAsyncMutation) {
                        // We skip broadcasting if there's another mutation happened synchronously
                        if (shouldAbort())
                            return [2 /*return*/, data];
                    }
                    // Update existing SWR Hooks' internal states:
                    return [2 /*return*/, broadcastState(cache, key, data, error, UNDEFINED, shouldRevalidate).then(function (res) {
                            // Throw error or return data
                            if (error)
                                throw error;
                            return res;
                        })];
            }
        });
    });
}
var addRevalidator = function (revalidators, key, callback) {
    if (!revalidators[key]) {
        revalidators[key] = [callback];
    }
    else {
        revalidators[key].push(callback);
    }
    return function () {
        var keyedRevalidators = revalidators[key];
        var index = keyedRevalidators.indexOf(callback);
        if (index >= 0) {
            // O(1): faster than splice
            keyedRevalidators[index] = keyedRevalidators[keyedRevalidators.length - 1];
            keyedRevalidators.pop();
        }
    };
};
function useSWR() {
    var _this = this;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = useArgs(args), _key = _a[0], fn = _a[1], config = _a[2];
    var cache = config.cache;
    var _b = getGlobalState(cache), FOCUS_REVALIDATORS = _b[0], RECONNECT_REVALIDATORS = _b[1], CACHE_REVALIDATORS = _b[2], MUTATION_TS = _b[3], MUTATION_END_TS = _b[4], CONCURRENT_PROMISES = _b[5], CONCURRENT_PROMISES_TS = _b[6];
    // `key` is the identifier of the SWR `data` state.
    // `keyErr` and `keyValidating` are indentifiers of `error` and `isValidating`
    // which are derived from `key`.
    // `fnArgs` is a list of arguments for `fn`.
    var _c = serialize(_key), key = _c[0], fnArgs = _c[1], keyErr = _c[2], keyValidating = _c[3];
    // If it's the first render of this hook.
    var initialMountedRef = useRef(false);
    var unmountedRef = useRef(false);
    // The ref to trace the current key.
    var keyRef = useRef(key);
    var configRef = useRef(config);
    // Get the current state that SWR should return.
    var resolveData = function () {
        var cachedData = cache.get(key);
        return isUndefined(cachedData) ? config.initialData : cachedData;
    };
    var data = resolveData();
    var error = cache.get(keyErr);
    // A revalidation must be triggered when mounted if:
    // - `revalidateOnMount` is explicitly set to `true`.
    // - Suspense mode and there's stale data for the inital render.
    // - Not suspense mode and there is no `initialData`.
    var shouldRevalidateOnMount = function () {
        if (!isUndefined(config.revalidateOnMount))
            return config.revalidateOnMount;
        return config.suspense
            ? !initialMountedRef.current && !isUndefined(data)
            : isUndefined(config.initialData);
    };
    // Resolve the current validating state.
    var resolveValidating = function () {
        if (!key)
            return false;
        if (cache.get(keyValidating))
            return true;
        // If it's not mounted yet and it should revalidate on mount, revalidate.
        return !initialMountedRef.current && shouldRevalidateOnMount();
    };
    var isValidating = resolveValidating();
    // do unmount check for callbacks
    // if key changed during the revalidation, old dispatch and config callback should not take effect.
    var safeCallback = useCallback(function (callback) {
        if (unmountedRef.current)
            return;
        if (key !== keyRef.current)
            return;
        if (!initialMountedRef.current)
            return;
        callback();
    }, [key]);
    var _d = useStateWithDeps({
        data: data,
        error: error,
        isValidating: isValidating
    }, unmountedRef), stateRef = _d[0], stateDependenciesRef = _d[1], setState = _d[2];
    // The revalidation function is a carefully crafted wrapper of the original
    // `fetcher`, to correctly handle the many edge cases.
    var revalidate = useCallback(function (revalidateOpts) {
        if (revalidateOpts === void 0) { revalidateOpts = {}; }
        return __awaiter(_this, void 0, void 0, function () {
            var _a, retryCount, _b, dedupe, loading, shouldDeduping, newData_1, startAt_1, newState, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!key || !fn)
                            return [2 /*return*/, false];
                        if (unmountedRef.current)
                            return [2 /*return*/, false];
                        if (configRef.current.isPaused())
                            return [2 /*return*/, false];
                        _a = revalidateOpts.retryCount, retryCount = _a === void 0 ? 0 : _a, _b = revalidateOpts.dedupe, dedupe = _b === void 0 ? false : _b;
                        loading = true;
                        shouldDeduping = !isUndefined(CONCURRENT_PROMISES[key]) && dedupe;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        cache.set(keyValidating, true);
                        setState({
                            isValidating: true
                        });
                        if (!shouldDeduping) {
                            // also update other hooks
                            broadcastState(cache, key, stateRef.current.data, stateRef.current.error, true);
                        }
                        if (!shouldDeduping) return [3 /*break*/, 3];
                        // there's already an ongoing request,
                        // this one needs to be deduplicated.
                        startAt_1 = CONCURRENT_PROMISES_TS[key];
                        return [4 /*yield*/, CONCURRENT_PROMISES[key]];
                    case 2:
                        newData_1 = _c.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        // if no cache being rendered currently (it shows a blank page),
                        // we trigger the loading slow event.
                        if (config.loadingTimeout && !cache.get(key)) {
                            setTimeout(function () {
                                if (loading)
                                    safeCallback(function () { return configRef.current.onLoadingSlow(key, config); });
                            }, config.loadingTimeout);
                        }
                        if (fnArgs !== null) {
                            CONCURRENT_PROMISES[key] = fn.apply(void 0, fnArgs);
                        }
                        else {
                            CONCURRENT_PROMISES[key] = fn(key);
                        }
                        CONCURRENT_PROMISES_TS[key] = startAt_1 = now();
                        return [4 /*yield*/, CONCURRENT_PROMISES[key]];
                    case 4:
                        newData_1 = _c.sent();
                        setTimeout(function () {
                            // CONCURRENT_PROMISES_TS[key] maybe be `undefined` or a number
                            if (CONCURRENT_PROMISES_TS[key] === startAt_1) {
                                delete CONCURRENT_PROMISES[key];
                                delete CONCURRENT_PROMISES_TS[key];
                            }
                        }, config.dedupingInterval);
                        // trigger the success event,
                        // only do this for the original request.
                        safeCallback(function () { return configRef.current.onSuccess(newData_1, key, config); });
                        _c.label = 5;
                    case 5:
                        // if there're other ongoing request(s), started after the current one,
                        // we need to ignore the current one to avoid possible race conditions:
                        //   req1------------------>res1        (current one)
                        //        req2---------------->res2
                        // the request that fired later will always be kept.
                        // CONCURRENT_PROMISES_TS[key] maybe be `undefined` or a number
                        if (CONCURRENT_PROMISES_TS[key] !== startAt_1) {
                            return [2 /*return*/, false];
                        }
                        // if there're other mutations(s), overlapped with the current revalidation:
                        // case 1:
                        //   req------------------>res
                        //       mutate------>end
                        // case 2:
                        //         req------------>res
                        //   mutate------>end
                        // case 3:
                        //   req------------------>res
                        //       mutate-------...---------->
                        // we have to ignore the revalidation result (res) because it's no longer fresh.
                        // meanwhile, a new revalidation should be triggered when the mutation ends.
                        if (!isUndefined(MUTATION_TS[key]) &&
                            // case 1
                            (startAt_1 <= MUTATION_TS[key] ||
                                // case 2
                                startAt_1 <= MUTATION_END_TS[key] ||
                                // case 3
                                MUTATION_END_TS[key] === 0)) {
                            setState({ isValidating: false });
                            return [2 /*return*/, false];
                        }
                        cache.set(keyErr, UNDEFINED);
                        cache.set(keyValidating, false);
                        newState = {
                            isValidating: false
                        };
                        if (!isUndefined(stateRef.current.error)) {
                            newState.error = UNDEFINED;
                        }
                        // Deep compare with latest state to avoid extra re-renders.
                        // For local state, compare and assign.
                        if (!config.compare(stateRef.current.data, newData_1)) {
                            newState.data = newData_1;
                        }
                        // For global state, it's possible that the key has changed.
                        // https://github.com/vercel/swr/pull/1058
                        if (!config.compare(cache.get(key), newData_1)) {
                            cache.set(key, newData_1);
                        }
                        // merge the new state
                        setState(newState);
                        if (!shouldDeduping) {
                            // also update other hooks
                            broadcastState(cache, key, newData_1, newState.error, false);
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _c.sent();
                        delete CONCURRENT_PROMISES[key];
                        delete CONCURRENT_PROMISES_TS[key];
                        if (configRef.current.isPaused()) {
                            setState({
                                isValidating: false
                            });
                            return [2 /*return*/, false];
                        }
                        // get a new error
                        // don't use deep equal for errors
                        cache.set(keyErr, err_2);
                        if (stateRef.current.error !== err_2) {
                            // we keep the stale data
                            setState({
                                isValidating: false,
                                error: err_2
                            });
                            if (!shouldDeduping) {
                                // also broadcast to update other hooks
                                broadcastState(cache, key, UNDEFINED, err_2, false);
                            }
                        }
                        // events and retry
                        safeCallback(function () { return configRef.current.onError(err_2, key, config); });
                        if (config.shouldRetryOnError) {
                            // when retrying, we always enable deduping
                            safeCallback(function () {
                                return configRef.current.onErrorRetry(err_2, key, config, revalidate, {
                                    retryCount: retryCount + 1,
                                    dedupe: true
                                });
                            });
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        loading = false;
                        return [2 /*return*/, true];
                }
            });
        });
    }, 
    // `setState` is immutable, and `eventsCallback`, `fnArgs`, `keyErr`,
    // and `keyValidating` are depending on `key`, so we can exclude them from
    // the deps array.
    //
    // FIXME:
    // `fn` and `config` might be changed during the lifecycle,
    // but they might be changed every render like this.
    // `useSWR('key', () => fetch('/api/'), { suspense: true })`
    // So we omit the values from the deps array
    // even though it might cause unexpected behaviors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]);
    // Always update config.
    useIsomorphicLayoutEffect(function () {
        configRef.current = config;
    });
    // After mounted or key changed.
    useIsomorphicLayoutEffect(function () {
        if (!key)
            return UNDEFINED;
        // Not the inital render.
        var keyChanged = initialMountedRef.current;
        var softRevalidate = function () { return revalidate({ dedupe: true }); };
        // Mark the component as mounted and update corresponding refs.
        unmountedRef.current = false;
        keyRef.current = key;
        // When `key` updates, reset the state to the initial value
        // and trigger a rerender if necessary.
        if (keyChanged) {
            setState({
                data: data,
                error: error,
                isValidating: isValidating
            });
        }
        // Trigger a revalidation.
        if (keyChanged || shouldRevalidateOnMount()) {
            if (isUndefined(data) || IS_SERVER) {
                softRevalidate();
            }
            else {
                // Delay the revalidate if we have data to return so we won't block
                // rendering.
                // @ts-ignore it's safe to use requestAnimationFrame in browser
                rAF(softRevalidate);
            }
        }
        // Add event listeners.
        var pending = false;
        var onFocus = function () {
            if (pending || !configRef.current.revalidateOnFocus)
                return;
            pending = true;
            softRevalidate();
            setTimeout(function () { return (pending = false); }, configRef.current.focusThrottleInterval);
        };
        var onReconnect = function () {
            if (configRef.current.revalidateOnReconnect) {
                softRevalidate();
            }
        };
        // Register global cache update listener.
        var onUpdate = function (shouldRevalidate, updatedData, updatedError, updatedIsValidating, dedupe) {
            if (shouldRevalidate === void 0) { shouldRevalidate = true; }
            if (dedupe === void 0) { dedupe = true; }
            setState(__assign({ error: updatedError, isValidating: updatedIsValidating }, (!config.compare(updatedData, stateRef.current.data)
                ? {
                    data: updatedData
                }
                : null)));
            if (shouldRevalidate) {
                return (dedupe ? softRevalidate : revalidate)();
            }
            return false;
        };
        var unsubFocus = addRevalidator(FOCUS_REVALIDATORS, key, onFocus);
        var unsubReconn = addRevalidator(RECONNECT_REVALIDATORS, key, onReconnect);
        var unsubUpdate = addRevalidator(CACHE_REVALIDATORS, key, onUpdate);
        // Finally, the component is mounted.
        initialMountedRef.current = true;
        return function () {
            // mark it as unmounted
            unmountedRef.current = true;
            unsubFocus();
            unsubReconn();
            unsubUpdate();
        };
    }, [key, revalidate]);
    // Polling
    useIsomorphicLayoutEffect(function () {
        var timer = 0;
        function nextTick() {
            var currentConfig = configRef.current;
            if (currentConfig.refreshInterval) {
                timer = setTimeout(tick, currentConfig.refreshInterval);
            }
        }
        function tick() {
            return __awaiter(this, void 0, void 0, function () {
                var currentConfig;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            currentConfig = configRef.current;
                            if (!(!stateRef.current.error &&
                                (currentConfig.refreshWhenHidden ||
                                    currentConfig.isDocumentVisible()) &&
                                (currentConfig.refreshWhenOffline || currentConfig.isOnline()))) return [3 /*break*/, 2];
                            // only revalidate when the page is visible
                            // if API request errored, we stop polling in this round
                            // and let the error retry function handle it
                            return [4 /*yield*/, revalidate({ dedupe: true })];
                        case 1:
                            // only revalidate when the page is visible
                            // if API request errored, we stop polling in this round
                            // and let the error retry function handle it
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            // Read the latest refreshInterval
                            if (timer)
                                nextTick();
                            return [2 /*return*/];
                    }
                });
            });
        }
        nextTick();
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
        };
    }, [
        config.refreshInterval,
        config.refreshWhenHidden,
        config.refreshWhenOffline,
        revalidate
    ]);
    // In Suspense mode, we can't return the empty `data` state.
    // If there is `error`, the `error` needs to be thrown to the error boundary.
    // If there is no `error`, the `revalidation` promise needs to be thrown to
    // the suspense boundary.
    if (config.suspense && isUndefined(data)) {
        if (isUndefined(error)) {
            throw revalidate({ dedupe: true });
        }
        throw error;
    }
    // `mutate`, but bound to the current key.
    var boundMutate = useCallback(function (newData, shouldRevalidate) {
        return internalMutate(cache, keyRef.current, newData, shouldRevalidate);
    }, 
    // `cache` isn't allowed to change during the lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    // Define the SWR state.
    // `revalidate` will be deprecated in the 1.x release
    // because `mutate()` covers the same use case of `revalidate()`.
    // This remains only for backward compatibility
    var state = {
        revalidate: revalidate,
        mutate: boundMutate
    };
    var currentStateDependencies = stateDependenciesRef.current;
    Object.defineProperties(state, {
        data: {
            get: function () {
                currentStateDependencies.data = true;
                return data;
            },
            enumerable: true
        },
        error: {
            get: function () {
                currentStateDependencies.error = true;
                return error;
            },
            enumerable: true
        },
        isValidating: {
            get: function () {
                currentStateDependencies.isValidating = true;
                return isValidating;
            },
            enumerable: true
        }
    });
    // Display debug info in React DevTools.
    useDebugValue(data);
    return state;
}
export var SWRConfig = SWRConfigContext.Provider;
Object.defineProperty(SWRConfig, 'default', {
    value: defaultConfig
});
export var mutate = internalMutate.bind(null, defaultConfig.cache);
export function createCache(provider) {
    var cache = wrapCache(provider);
    return {
        cache: cache,
        mutate: internalMutate.bind(null, cache)
    };
}
export default useSWR;
