import { Module } from '@nestjs/common';
import { createClient } from 'redis';

@Module({
    providers:[
        {
            provide:"REDIS_CLIENT",
            useFactory:async()=>{
                const clinet = createClient({
                    url:process.env.REDIS_URL,
                });
                await clinet.connect();
                return clinet;
            }
        }
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
