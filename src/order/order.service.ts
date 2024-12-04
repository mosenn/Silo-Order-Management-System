import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order';
import { UpdateOrderDto } from './dto/update-order';
import { Farmer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisClientType } from 'redis';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService , 
    @Inject('REDIS_CLIENT') private readonly redisClinet: RedisClientType,
  ) {}

  // ثبت سفارش جدید توسط کشاورز
  async createOrder(farmer: Farmer, createOrderDto: CreateOrderDto) {
    try {
      const order = await this.prisma.order.create({
        data: {
          ...createOrderDto,
          farmerId: farmer.id,
        },
        include: {
          farmer: { select: { username: true ,email:true } },
        },
      });
      await this.redisClinet.del(farmer.id);

      const username = farmer.username;

      return {
        message: `${username} محصول شما با موفقیت ایجاد شد`,
        data: order,
      };
    } catch (err) {
      console.log('create order have a error', err);
    }
  }

  // مشاهده سفارش‌ها مربوط به کشاورز
  async findSingleOrdersFarmer(farmer: Farmer | null ) {
    try {

    // Check cache
    const cachedValue = await this.redisClinet.get(farmer.id);
    if (cachedValue) {
      return { source: 'cache', value:  JSON.parse(cachedValue)};
    }

      const farmerFindOrders = await this.prisma.order.findMany({
        where: {
          farmerId: farmer.id,
        },
        include: {
          farmer: true,
        },
      });

      if (farmerFindOrders && farmerFindOrders.length > 0) {
        // ذخیره نتیجه در کش
        await this.redisClinet.set(farmer.id, JSON.stringify(farmerFindOrders));
        return { source: 'database', value: farmerFindOrders };
      }

      return { error: 'محصولی برای شما با این نام کاربری وجود نداره' };

      // const username = farmer.username;

      // return {
      //   message: `${username} محصولاتی که شما ایجاد کردید`,
      //   data: farmerFindOrders,
      // };
    } catch (err) {
      console.log('have a error takes orders with farmers ', err);
    }
  }
  // مشاهده تمامی سفارش ها توسط ادمین
  async allOrders() {
    try {
      const adminTakeAllOrders = await this.prisma.order.findMany();
      return { message: 'تمامی محصولات حال حاضر', data: adminTakeAllOrders };
    } catch (err) {
      console.log('have a error take all orders with admin ', err);
    }
  }

  //    سفارش توسط مدیر status تغییر
  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const updateOrder = await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });

      return { message: 'وضیعت محصول با موفقیت تغییر کرد', data: updateOrder };
    } catch (err) {
      console.log('update status have a error', err);
    }
  }
}
