import { Controller, Logger, Post, Response, UseGuards } from '@nestjs/common';
import { Response as Res } from 'express';

import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { EXP_DAYS, SECURE_TK, TK } from '../constants';
import { User } from '../user/entities/user.entity';
import { TokenVo } from '../user/vo/token.vo';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public-auth.guard';

/**
 * AuthController.
 *
 * @author dafengzhen
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {
    this.logger.debug('AuthController init');
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Response() response: Res, @CurrentUser() user: User) {
    const vo = new TokenVo({
      expDays: EXP_DAYS,
      id: user.id,
      token: this.authService.getTokenForUser(user),
      username: user.username,
    });

    const _isHttpsSite = isHttpsSite();
    response
      .cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
        httpOnly: true,
        maxAge: getMaxAge(vo.expDays),
        path: '/',
        sameSite: 'strict',
        secure: _isHttpsSite,
      })
      .send(vo);
  }
}
