import defaultConfig from './config';
import { Fetcher } from './types';
export default function useArgs<KeyType, ConfigType, Data>(args: readonly [KeyType] | readonly [KeyType, Fetcher<Data> | null] | readonly [KeyType, ConfigType | undefined] | readonly [KeyType, Fetcher<Data> | null, ConfigType | undefined]): [KeyType, Fetcher<Data> | null, (typeof defaultConfig) & ConfigType];
