import { SetMetadata } from '@nestjs/common';

export const CUSTOM_CACHE_KEY = 'customCacheOptions';

export interface CustomCacheOptions {
  ttl?: number; 
  enabled?: boolean; 
}

export const CustomCache = (options: CustomCacheOptions) =>
  SetMetadata(CUSTOM_CACHE_KEY, options);
