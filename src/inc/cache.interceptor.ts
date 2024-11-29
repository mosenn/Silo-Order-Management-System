import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, of } from 'rxjs';
  import { Reflector } from '@nestjs/core';
  import { CUSTOM_CACHE_KEY, CustomCacheOptions } from '../decorator/custom-cache.decorator';

  
  import { RedisClientType } from 'redis';
  import { Inject } from '@nestjs/common';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class CacheInterceptor implements NestInterceptor {
    constructor(
      private readonly reflector: Reflector,
      @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    ) {}
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const key = `${request.method}:${request.url}`; // کلید یکتا برای هر درخواست
  
      const cacheOptions = this.reflector.get<CustomCacheOptions>(
        CUSTOM_CACHE_KEY,
        context.getHandler(),
      );
  
      // اگر کش غیرفعال باشد
      if (!cacheOptions?.enabled) {
        return next.handle();
      }
  
      // اگر کش فعال باشد، ابتدا از Redis بررسی می‌کنیم
      const cachedResponse = await this.redisClient.get(key);
      if (cachedResponse) {
        return of(JSON.parse(cachedResponse));
      }
  
      // اگر کشی وجود نداشت، ادامه داده و نتیجه را ذخیره می‌کنیم
      return next.handle().pipe(
        map(async (response) => {
          if (cacheOptions.ttl) {
            await this.redisClient.set(key, JSON.stringify(response), {
              EX: cacheOptions.ttl, // زمان انقضا
            });
          }
          return response;
        }),
      );
    }
  }
  