import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { History } from './entities/history.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

/**
 * HistoryModule
 *
 * @author dafengzhen
 */
@Module({
  controllers: [HistoryController],
  imports: [TypeOrmModule.forFeature([History])],
  providers: [HistoryService],
})
export class HistoryModule {}
