import { Injectable } from '@nestjs/common';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  constructor() {}

  health() {
    return {
      status: 'UP',
    };
  }
}
