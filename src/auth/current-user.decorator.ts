import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { createParamDecorator } from '@nestjs/common';

import type { User } from '../user/entities/user.entity';

/**
 * CurrentUser.
 *
 * @author dafengzhen
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as User;
});
