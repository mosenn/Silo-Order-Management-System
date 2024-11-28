import { Strategy, ExtractJwt } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: {
    id: string;
    email: string;
    username: string;
    role: string;
  }) {
    return { ...payload ,};
  }
}
