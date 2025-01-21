import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CollectionService } from './collection/collection.service';
import { Collection } from './collection/entities/collection.entity';
import { Excerpt } from './excerpt/entities/excerpt.entity';
import { ExcerptService } from './excerpt/excerpt.service';
import { User } from './user/entities/user.entity';

/**
 * AppService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly collectionService: CollectionService,
    private readonly excerptService: ExcerptService,
    private readonly dataSource: DataSource,
  ) {}

  health() {
    return {
      status: 'UP',
    };
  }
}
