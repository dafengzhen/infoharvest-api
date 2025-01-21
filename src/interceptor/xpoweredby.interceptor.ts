import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Response } from 'express';
import type { Observable } from 'rxjs';

/**
 * XPoweredByInterceptor.
 *
 * @author dafengzhen
 */
export class XPoweredByInterceptor implements NestInterceptor {
  private readonly xPoweredBy: string;

  constructor(xPoweredBy: string) {
    this.xPoweredBy = xPoweredBy;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    response.header('X-Powered-By', this.xPoweredBy);
    return next.handle();
  }
}
