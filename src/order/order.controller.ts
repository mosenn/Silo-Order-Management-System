// src/orders/order.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order';
import { UpdateOrderDto } from './dto/update-order';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../guards/Roles/roles.guards';
import { Roles } from '../decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CustomCache } from 'src/decorator/custom-cache.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ثبت سفارش جدید توسط کشاورز
  @CustomCache({ enabled: false })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.createOrder(req.user, createOrderDto);
  }

  // مشاهده سفارش‌ها کشاورز
  @CustomCache({ ttl: 600, enabled: true }) // 10 min cache
  @Get('farmer/orders')
  @UseGuards(JwtAuthGuard)
  async findOrders(@Request() req) {
    return this.orderService.findSingleOrdersFarmer(req.user);
  }

  // دیدن تمامی سفارش ها توسط مدیر
  @CustomCache({ ttl: 600, enabled: true }) // 10 min cache
  @Get('/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async findAllOrders() {
    return this.orderService.allOrders();
  }

  // تغییر وضعیت سفارش توسط مدیر
  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderDto);
  }
}
