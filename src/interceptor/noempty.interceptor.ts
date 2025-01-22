import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';

import { map } from 'rxjs';

/**
 * NoEmptyInterceptor.
 *
 * Intercepts the response to remove null and undefined values from arrays and objects.
 *
 * @author dafengzhen
 */
export class NoEmptyInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(this.removeNullAndUndefinedValues));
  }

  private removeNullAndUndefinedValues = (data: unknown): unknown => {
    if (Array.isArray(data)) {
      return data.map(this.removeNullAndUndefinedValues).filter(isNotNullOrUndefined);
    }

    if (data && typeof data === 'object' && !(data instanceof Date)) {
      return Object.fromEntries(
        Object.entries(data)
          .map(([key, value]) => [key, this.removeNullAndUndefinedValues(value)])
          .filter(([, value]) => isNotNullOrUndefined(value)),
      );
    }

    return data;
  };
}

/**
 * Checks if a value is not null or undefined.
 *
 * @param value - The value to check.
 * @returns True if the value is neither null nor undefined.
 */
const isNotNullOrUndefined = (value: unknown): boolean => value != null;
