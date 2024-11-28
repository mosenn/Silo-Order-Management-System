import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FarmerService {
  constructor(private prisma: PrismaService) {}



  async singleFarmer(id: string) {
    return this.prisma.farmer.findUnique({
      where: { id },
    });
  }
}
