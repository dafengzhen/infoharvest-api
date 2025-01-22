import type { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import type { Request } from 'express';

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * DynamicValidationOptions.
 *
 * @author dafengzhen
 */
export const DynamicValidationOptions = createParamDecorator(
  (
    data: ValidationPipeOptions = {
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
      whitelist: false,
    },
    ctx: ExecutionContext,
  ) => {
    void data;
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.body as unknown;
  },
);
