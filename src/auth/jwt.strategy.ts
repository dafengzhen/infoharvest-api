import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request as Req } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { isHttpsSite } from '../common/tool/tool';
import { AUTHORIZATION, BEARER, SECURE_TK, TK } from '../constants';
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
        (req: Req) => JwtStrategy.extractJWT(req),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.TOKEN_SECRET as string,
    });
  }

  static extractAuthHeaderAsBearerToken(req: Req): null | string | undefined {
    const header = req.headers[AUTHORIZATION] ?? req.headers[AUTHORIZATION.toLowerCase()];
    const bearer = `${BEARER} `;
    if (typeof header === 'string' && header.startsWith(bearer) && header.length > bearer.length * 2) {
      return header;
    }
  }

  static extractJWT(req: Req): null | string {
    const key = isHttpsSite() ? SECURE_TK : TK;
    if (typeof req.cookies === 'object') {
      const tk = (req.cookies as Record<string, string>)[key];
      if (typeof tk === 'string' && tk.length > 0) {
        return tk;
      }
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    return this.authService.getUserByIdAndToken(Number(payload.sub));
  }
}
