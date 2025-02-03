import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Collection } from '../collection/entities/collection.entity';
import { History } from '../history/entities/history.entity';
import { ExcerptLink } from './entities/excerpt-link.entity';
import { ExcerptName } from './entities/excerpt-name.entity';
import { Excerpt } from './entities/excerpt.entity';
import { ExcerptQueryController } from './excerpt-query.controller';
import { ExcerptController } from './excerpt.controller';
import { ExcerptService } from './excerpt.service';

/**
 * ExcerptModule,
 *
 * @author dafengzhen
 */
@Module({
  controllers: [ExcerptQueryController, ExcerptController],
  imports: [TypeOrmModule.forFeature([Collection, Excerpt, ExcerptName, ExcerptLink, History])],
  providers: [ExcerptService],
})
export class ExcerptModule {}
