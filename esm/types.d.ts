export declare type Fetcher<Data> = (...args: any) => Data | Promise<Data>;
export interface Configuration<Data = any, Error = any, Fn extends Fetcher<Data> = Fetcher<Data>> {
    errorRetryInterval: number;
    errorRetryCount?: number;
    loadingTimeout: number;
    focusThrottleInterval: number;
    dedupingInterval: number;
    refreshInterval: number;
    refreshWhenHidden: boolean;
    refreshWhenOffline: boolean;
    revalidateOnFocus: boolean;
    revalidateOnMount?: boolean;
    revalidateOnReconnect: boolean;
    shouldRetryOnError: boolean;
    suspense: boolean;
    fetcher: Fn;
    initialData?: Data;
    cache: Cache;
    isPaused: () => boolean;
    onLoadingSlow: (key: string, config: Readonly<Configuration<Data, Error>>) => void;
    onSuccess: (data: Data, key: string, config: Readonly<Configuration<Data, Error>>) => void;
    onError: (err: Error, key: string, config: Readonly<Configuration<Data, Error>>) => void;
    onErrorRetry: (err: Error, key: string, config: Readonly<Configuration<Data, Error>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void;
    compare: (a: Data | undefined, b: Data | undefined) => boolean;
}
export interface Preset {
    isOnline: () => boolean;
    isDocumentVisible: () => boolean;
    registerOnFocus?: (cb: () => void) => void;
    registerOnReconnect?: (cb: () => void) => void;
}
export declare type ValueKey = string | any[] | null;
export declare type Updater<Data = any, Error = any> = (shouldRevalidate?: boolean, data?: Data, error?: Error, shouldDedupe?: boolean, dedupe?: boolean) => boolean | Promise<boolean>;
export declare type MutatorCallback<Data = any> = (currentValue: undefined | Data) => Promise<undefined | Data> | undefined | Data;
export declare type Broadcaster<Data = any, Error = any> = (cache: Cache, key: string, data: Data, error?: Error, isValidating?: boolean, shouldRevalidate?: boolean) => Promise<Data>;
export declare type State<Data, Error> = {
    data?: Data;
    error?: Error;
    isValidating?: boolean;
};
export declare type Mutator<Data = any> = (cache: Cache, key: Key, data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
export interface ScopedMutator<Data = any> {
    /** This is used for bound mutator */
    (key: Key, data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean): Promise<Data | undefined>;
    /** This is used for global mutator */
    <T = any>(key: Key, data?: T | Promise<T> | MutatorCallback<T>, shouldRevalidate?: boolean): Promise<T | undefined>;
}
export declare type KeyedMutator<Data> = (data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
/**
 * @deprecated `ConfigInterface` will be renamed to `SWRConfiguration`.
 */
export declare type ConfigInterface<Data = any, Error = any, Fn extends Fetcher<Data> = Fetcher<Data>> = Partial<Configuration<Data, Error, Fn>>;
export declare type SWRConfiguration<Data = any, Error = any, Fn extends Fetcher<Data> = Fetcher<Data>> = Partial<Configuration<Data, Error, Fn>>;
/**
 * @deprecated `keyInterface` will be renamed to `Key`.
 */
export declare type keyInterface = ValueKey | (() => ValueKey);
export declare type Key = ValueKey | (() => ValueKey);
/**
 * @deprecated `responseInterface` will be renamed to `SWRResponse`.
 */
export declare type responseInterface<Data, Error> = {
    data?: Data;
    error?: Error;
    revalidate: () => Promise<boolean>;
    mutate: KeyedMutator<Data>;
    isValidating: boolean;
};
export interface SWRResponse<Data, Error> {
    data?: Data;
    error?: Error;
    /**
     * @deprecated `revalidate` is deprecated, please use `mutate()` for the same purpose.
     */
    revalidate: () => Promise<boolean>;
    mutate: KeyedMutator<Data>;
    isValidating: boolean;
}
export declare type KeyLoader<Data = any> = ((index: number, previousPageData: Data | null) => ValueKey) | null;
/**
 * @deprecated `SWRInfiniteConfigInterface` will be renamed to `SWRInfiniteConfiguration`.
 */
export declare type SWRInfiniteConfigInterface<Data = any, Error = any> = SWRConfiguration<Data[], Error, Fetcher<Data[]>> & {
    initialSize?: number;
    revalidateAll?: boolean;
    persistSize?: boolean;
};
export declare type SWRInfiniteConfiguration<Data = any, Error = any> = SWRConfiguration<Data[], Error, Fetcher<Data[]>> & {
    initialSize?: number;
    revalidateAll?: boolean;
    persistSize?: boolean;
};
/**
 * @deprecated `SWRInfiniteResponseInterface` will be renamed to `SWRInfiniteResponse`.
 */
export declare type SWRInfiniteResponseInterface<Data = any, Error = any> = SWRResponse<Data[], Error> & {
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<Data[] | undefined>;
};
export interface SWRInfiniteResponse<Data = any, Error = any> extends SWRResponse<Data[], Error> {
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<Data[] | undefined>;
}
/**
 * @deprecated `RevalidateOptionInterface` will be renamed to `RevalidatorOptions`.
 */
export interface RevalidateOptionInterface {
    retryCount?: number;
    dedupe?: boolean;
}
export interface RevalidatorOptions {
    retryCount?: number;
    dedupe?: boolean;
}
/**
 * @deprecated `revalidateType` will be renamed to `Revalidator`.
 */
export declare type revalidateType = (revalidateOpts: RevalidatorOptions) => Promise<boolean>;
export declare type Revalidator = (revalidateOpts: RevalidatorOptions) => Promise<boolean>;
export interface Cache<Data = any> {
    get(key: Key): Data | null | undefined;
    set(key: Key, value: Data): void;
    delete(key: Key): void;
}
