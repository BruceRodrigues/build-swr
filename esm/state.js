import { useRef, useCallback, useState } from 'react';
import { useIsomorphicLayoutEffect } from './env';
/**
 * An implementation of state with dependency-tracking.
 */
export default function useStateWithDeps(state, unmountedRef) {
    var rerender = useState({})[1];
    var stateRef = useRef(state);
    // If a state property (data, error or isValidating) is accessed by the render
    // function, we mark the property as a dependency so if it is updated again
    // in the future, we trigger a rerender.
    // This is also known as dependency-tracking.
    var stateDependenciesRef = useRef({
        data: false,
        error: false,
        isValidating: false
    });
    /**
     * @param payload To change stateRef, pass the values explicitly to setState:
     * @example
     * ```js
     * setState({
     *   isValidating: false
     *   data: newData // set data to newData
     *   error: undefined // set error to undefined
     * })
     *
     * setState({
     *   isValidating: false
     *   data: undefined // set data to undefined
     *   error: err // set error to err
     * })
     * ```
     */
    var setState = useCallback(function (payload) {
        var shouldRerender = false;
        var currentState = stateRef.current;
        for (var _i = 0, _a = Object.keys(payload); _i < _a.length; _i++) {
            var _ = _a[_i];
            // Type casting to work around the `for...in` loop
            // https://github.com/Microsoft/TypeScript/issues/3500
            var k = _;
            // If the property hasn't changed, skip
            if (currentState[k] === payload[k]) {
                continue;
            }
            currentState[k] = payload[k];
            // If the property is accessed by the component, a rerender should be
            // triggered.
            if (stateDependenciesRef.current[k]) {
                shouldRerender = true;
            }
        }
        if (shouldRerender && !unmountedRef.current) {
            rerender({});
        }
    }, 
    // config.suspense isn't allowed to change during the lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    // Always update the state reference.
    useIsomorphicLayoutEffect(function () {
        stateRef.current = state;
    });
    return [stateRef, stateDependenciesRef, setState];
}
