import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { CollectionQueryController } from './collection-query.controller';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './entities/collection.entity';

/**
 * CollectionModule,
 *
 * @author dafengzhen
 */
@Module({
  controllers: [CollectionQueryController, CollectionController],
  imports: [TypeOrmModule.forFeature([Collection, Excerpt, ExcerptName, ExcerptLink, History])],
  providers: [CollectionService],
})
export class CollectionModule {}
