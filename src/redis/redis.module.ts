import { Module } from '@nestjs/common';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; 

        const client = createClient({
          url: redisUrl,
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
