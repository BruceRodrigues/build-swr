import { KeyLoader, Fetcher, SWRInfiniteConfiguration, SWRInfiniteResponse } from './types';
declare function useSWRInfinite<Data = any, Error = any>(...args: readonly [KeyLoader<Data>] | readonly [KeyLoader<Data>, Fetcher<Data> | null] | readonly [KeyLoader<Data>, SWRInfiniteConfiguration<Data, Error> | undefined] | readonly [KeyLoader<Data>, Fetcher<Data> | null, SWRInfiniteConfiguration<Data, Error> | undefined]): SWRInfiniteResponse<Data, Error>;
export { useSWRInfinite };
