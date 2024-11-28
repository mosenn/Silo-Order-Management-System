import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDto } from './dto/register-auth';
import { loginDto } from './dto/login-auth';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //*POST -  register

  async farmerRegister(body: registerDto) {
    // * check user before register
    const farmer = await this.prisma.farmer.findUnique({
      where: {
        email: body.email,
      },
      select: { email: true },
    });
    if (farmer) {
      throw new UnauthorizedException('با این ایمیل قبلا ثبت نام کردید');
    }

    //* hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    const role: Role =
      body.role === 'ADMIN' || body.role === 'FARMER'
        ? (body.role as Role)
        : Role.FARMER;

    //* create Farmer
    const newFarmer = await this.prisma.farmer.create({
      data: {
        ...body,
        role,
        password: hashPassword,
      },
    });
    return { message: 'شما به عنوان کشاورز ثبت نام شدید', newFarmer };
  }

  //*POST -  Login
  async farmerLogin(body: loginDto) {
    const { email } = body;
    //* found farmer
    const farmer = await this.prisma.farmer.findUnique({
      where: { email },

      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        role: true,
      },
    });
    //* check farmer exist or not
    if (!farmer) {
      throw new BadRequestException('email or password is worng');
    }
    //* compare password
    const comparePassword = await bcrypt.compare(
      body.password,
      farmer.password,
    );
    if (!comparePassword) {
      throw new UnauthorizedException();
    }
    const { id, username , role} = farmer;
    console.log(id, username);
    //* sign token
    const token = await this.jwtService.sign({
      id,
      email,
      username,
      role
    });
    return {
      token: token,
      data: farmer,
      message: ` ${farmer.email}  لاگین شدید خوش امدید`,
    };
  }
}
