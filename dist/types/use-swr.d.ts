import { Fetcher, Key, SWRResponse, SWRConfiguration, Cache, ScopedMutator } from './types';
declare function useSWR<Data = any, Error = any>(...args: readonly [Key] | readonly [Key, Fetcher<Data> | null] | readonly [Key, SWRConfiguration<Data, Error> | undefined] | readonly [Key, Fetcher<Data> | null, SWRConfiguration<Data, Error> | undefined]): SWRResponse<Data, Error>;
export declare const SWRConfig: import("react").Provider<Partial<import("./types").Configuration<any, any, Fetcher<any>>>> & {
    default: Partial<import("./types").Configuration<any, any, Fetcher<any>>>;
};
export declare const mutate: ScopedMutator<any>;
export declare function createCache<Data>(provider: Cache): {
    cache: Cache;
    mutate: ScopedMutator<Data>;
};
export default useSWR;
