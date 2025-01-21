import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';

/**
 * CollectionModule,
 *
 * @author dafengzhen
 */
@Module({
  controllers: [CollectionController],
  imports: [TypeOrmModule.forFeature([Collection, Excerpt, ExcerptName, ExcerptLink, ExcerptState, History])],
  providers: [CollectionService],
})
export class CollectionModule {}
