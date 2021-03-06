import { MutableRefObject } from 'react';
import { State } from './types';
declare type StateKeys = keyof State<any, any>;
/**
 * An implementation of state with dependency-tracking.
 */
export default function useStateWithDeps<Data, Error, S = State<Data, Error>>(state: S, unmountedRef: MutableRefObject<boolean>): [MutableRefObject<S>, MutableRefObject<Record<StateKeys, boolean>>, (payload: S) => void];
export {};
