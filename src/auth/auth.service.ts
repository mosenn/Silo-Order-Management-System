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
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //*POST -  register

  async farmerRegister(body: registerDto) {
    // * check user before register
    const user = await this.prisma.farmer.findUnique({
      where: {
        email: body.email,
      },
      select: { email: true },
    });
    // console.log(user, 'user check user');
    if (user) {
      throw new UnauthorizedException('با این ایمیل قبلا ثبت نام کردید');
    }
    // console.log('body : ', body);

    //* hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    //* create user
    const newUser = await this.prisma.farmer.create({
      data: {
        ...body,

        // role: Role.USER,
        password: hashPassword,
        // pic:'https://i.ibb.co/HNXCbHM/user.png'
      },
    });
    // console.log('new user', newUser);
    return { message: 'شما به عنوان کشاورز ثبت نام شدید', newUser };
  }

  //*POST -  Login
  async farmerLogin(body: loginDto) {
    const { email } = body;
    //* found farmer
    const farmer = await this.prisma.farmer.findUnique({
      where: { email },
      //   role:true
      select: { id: true, email: true, password: true, username: true },
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
    const { id, username } = farmer;
    console.log(id, username);
    //* sign token
    const token = await this.jwtService.sign({
      id,
      email,
      username,
    });
    return {
      token: token,
      data: farmer,
      message: ` ${farmer.email}  لاگین شدید خوش امدید`,
    };
  }
}
