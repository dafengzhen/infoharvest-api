import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { QueryHistoryDto } from './dto/query-history.dto';
import { HistoryService } from './history.service';

/**
 * HistoryController,
 *
 * @author dafengzhen
 */
@Controller('histories')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private readonly historyService: HistoryService) {
    this.logger.debug('HistoryController init');
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @CurrentUser() user: User,
    @Query()
    query: QueryHistoryDto,
  ) {
    return this.historyService.findAll(user, query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.historyService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.historyService.remove(+id, user);
  }

  @Delete()
  removeAll(@CurrentUser() user: User, @Query() query: QueryHistoryDto) {
    return this.historyService.removeAll(query, user);
  }
}
