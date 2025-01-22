import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { isHttpsSite } from '../common/tool/tool';
import { AUTHORIZATION, BEARER, SECURE_TK, TK } from '../constants';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

/**
 * JwtStrategy.
 *
 * @author dafengzhen
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => JwtStrategy.extractJWT(request),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.TOKEN_SECRET as string,
    });
  }

  static extractAuthHeaderAsBearerToken(request: Request): null | string | undefined {
    const header = request.headers[AUTHORIZATION] ?? request.headers[AUTHORIZATION.toLowerCase()];
    const bearer = `${BEARER} `;
    if (typeof header === 'string' && header.startsWith(bearer) && header.length > bearer.length * 2) {
      return header;
    }
  }

  static extractJWT(request: Request): null | string {
    if (request.cookies) {
      const key = isHttpsSite() ? SECURE_TK : TK;
      return request.cookies[key] as null | string;
    }
    return null;
  }

  async validate(payload: { sub?: number }): Promise<User> {
    return this.authService.findOneBy(payload.sub);
  }
}
