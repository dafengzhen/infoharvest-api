import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Collection } from '../collection/entities/collection.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Collection, Excerpt, ExcerptName, ExcerptLink, ExcerptState, History]),
  ],
  providers: [UserService],
})
export class UserModule {}
