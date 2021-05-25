import { useEffect, useLayoutEffect } from 'react';
export var IS_SERVER = typeof window === 'undefined' ||
    // @ts-ignore
    !!(typeof Deno !== 'undefined' && Deno.version && Deno.version.deno);
var __requestAnimationFrame = !IS_SERVER
    ? window['requestAnimationFrame']
    : null;
// polyfill for requestAnimationFrame
export var rAF = IS_SERVER
    ? null
    : __requestAnimationFrame
        ? function (f) { return __requestAnimationFrame(f); }
        : function (f) { return setTimeout(f, 1); };
// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
export var useIsomorphicLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect;
// client side: need to adjust the config
// based on the browser status
// slow connection (<= 70Kbps)
export var slowConnection = !IS_SERVER &&
    // @ts-ignore
    navigator['connection'] &&
    // @ts-ignore
    ['slow-2g', '2g'].indexOf(navigator['connection'].effectiveType) !== -1;
