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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data: unknown) => this.removeNullAndUndefinedValues(data)));
  }

  private removeNullAndUndefinedValues(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.removeNullAndUndefinedValues(item)).filter(isNotNullOrUndefined);
    } else if (data && typeof data === 'object' && !(data instanceof Date)) {
      return Object.fromEntries(
        Object.entries(data as Record<string, unknown>)
          .map(([key, value]) => [key, this.removeNullAndUndefinedValues(value)])
          .filter(([, value]) => isNotNullOrUndefined(value)),
      );
    }
    return data;
  }
}

/**
 * Checks if a value is not null or undefined.
 *
 * @param value - The value to check.
 * @returns True if the value is neither null nor undefined.
 */
function isNotNullOrUndefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}
