import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TGeneralObject } from '../../interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log(process.env.JWT_SECRET, 'JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  validate(payload: TGeneralObject) {
    return { id: payload.sub, email: payload.email };
  }
}
