import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  grainType: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}
