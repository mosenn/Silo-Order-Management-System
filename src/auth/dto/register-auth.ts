// import { Role } from '@prisma/client';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class registerDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either Farmer or Admin' })
  role?: Role;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    {
      message:
        '(@$!%*#?&) رمز عبور باید حداقل ۸ کاراکتر باشد و شامل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر خاص ',
    },
  )
  password: string;
}
