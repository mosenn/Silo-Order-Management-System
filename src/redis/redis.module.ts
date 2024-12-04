import { Module } from '@nestjs/common';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: 'redis://:ItHmO03p0NLgZMnl9OlYRtnC@fuji.liara.cloud:33073/0',
        });

        client.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
