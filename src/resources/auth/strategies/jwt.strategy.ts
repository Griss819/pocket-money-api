import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import * as process from 'node:process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    } as StrategyOptionsWithoutRequest);
  }

  validate(payload: PayloadDto) {
    return { userId: payload.sub, email: payload.email };
  }
}
