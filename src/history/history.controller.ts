import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { IPagination } from '../common/interface/pagination';
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { QueryHistoryDto } from './dto/query-history.dto';
import { UpdateCustomConfigHistoryDto } from './dto/update-custom-config-history.dto';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';

/**
 * HistoryController,
 *
 * @author dafengzhen
 */
@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query() dto: QueryHistoryDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<History[] | IPagination<History>> {
    return this.historyService.findAll(dto, currentUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigHistoryDto: UpdateCustomConfigHistoryDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.historyService.updateCustomConfig(+id, updateCustomConfigHistoryDto, currentUser);
  }
}
