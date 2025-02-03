import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './auth/public-auth.guard';

/**
 * AppController.
 *
 * @author dafengzhen
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  async health(): Promise<{
    status: 'UP';
  }> {
    return this.appService.health();
  }
}
