import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { RedisModule } from './redis/redis.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './inc/cache.interceptor';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    OrderModule,
    RedisModule,
  ],

  controllers: [AppController, AuthController, OrderController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    OrderService,
    {
      provide:APP_INTERCEPTOR,
      useClass:CacheInterceptor
    }
  ],
})
export class AppModule {}
