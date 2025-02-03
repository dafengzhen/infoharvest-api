import { Injectable } from '@nestjs/common';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  constructor() {}

  async health(): Promise<{
    status: 'UP';
  }> {
    return Promise.resolve({
      status: 'UP',
    });
  }
}
