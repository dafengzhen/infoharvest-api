import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

/**
 * LocalStrategy.
 *
 * @author dafengzhen
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    return this.authService.validate(username, password);
  }
}
