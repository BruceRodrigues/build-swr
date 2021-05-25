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
import { useContext } from 'react';
import defaultConfig from './config';
import SWRConfigContext from './config-context';
// Resolve arguments for SWR hooks.
// This function itself is a hook because it uses `useContext` inside.
export default function useArgs(args) {
    var config = __assign(__assign(__assign({}, defaultConfig), useContext(SWRConfigContext)), (args.length > 2
        ? args[2]
        : args.length === 2 && typeof args[1] === 'object'
            ? args[1]
            : {}));
    // In TypeScript `args.length > 2` is not same as `args.lenth === 3`.
    // We do a safe type assertion here.
    var fn = (args.length > 2
        ? args[1]
        : args.length === 2 && typeof args[1] === 'function'
            ? args[1]
            : // Pass fn as null will disable revalidate
                // https://paco.sh/blog/shared-hook-state-with-swr
                args[1] === null
                    ? args[1]
                    : config.fetcher);
    return [args[0], fn, config];
}
