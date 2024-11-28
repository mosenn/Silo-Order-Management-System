// src/orders/dto/update-order.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()

  status?: string;
}
