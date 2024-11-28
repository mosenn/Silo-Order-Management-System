import { Body, Controller, Post } from '@nestjs/common';
import { registerDto } from './dto/register-auth';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() body: registerDto) {
    return await this.authService.farmerRegister(body);
  }

  @Post('login')
  async login(@Body() body: loginDto) {
    return await this.authService.farmerLogin(body);
  }
}
