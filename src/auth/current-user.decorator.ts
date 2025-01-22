import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { createParamDecorator } from '@nestjs/common';

import type { User } from '../user/entities/user.entity';

export type TCurrentUser = Readonly<null | undefined | User>;

/**
 * CurrentUser.
 *
 * @author dafengzhen
 */
export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as TCurrentUser;
});
