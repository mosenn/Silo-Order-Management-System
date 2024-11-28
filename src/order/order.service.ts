import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order';
import { UpdateOrderDto } from './dto/update-order';
import { Farmer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // ثبت سفارش جدید توسط کشاورز
  async createOrder(farmer: Farmer, createOrderDto: CreateOrderDto) {
    try {
      const order = this.prisma.order.create({
        data: {
          ...createOrderDto,
          farmerId: farmer.id,
        },
        include: {
          farmer: { select: { username: true } },
        },
      });

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
  async findSingleOrdersFarmer(farmer: Farmer | null) {
    try {
      const farmerFindOrders = this.prisma.order.findMany({
        where: {
          farmerId: farmer.id,
        },
        include: {
          farmer: true,
        },
      });
      const username = farmer.username;

      return {
        message: `${username} محصولاتی که شما ایجاد کردید`,
        data: farmerFindOrders,
      };
    } catch (err) {
      console.log('have a error takes orders with farmers ', err);
    }
  }
  // مشاهده تمامی سفارش ها توسط ادمین
  async allOrders() {
    try {
      const adminTakeAllOrders = this.prisma.order.findMany();
      return { message: 'تمامی محصولات حال حاضر', data: adminTakeAllOrders };
    } catch (err) {
      console.log('have a error take all orders with admin ', err);
    }
  }

  //    سفارش توسط مدیر status تغییر
  async updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const updateOrder = this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });

      return { message: 'وضیعت محصول با موفقیت تغییر کرد', data: updateOrder };
    } catch (err) {
      console.log('update status have a error', err);
    }
  }
}
