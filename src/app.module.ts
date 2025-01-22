import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CollectionModule } from './collection/collection.module';
import { CollectionService } from './collection/collection.service';
import { Collection } from './collection/entities/collection.entity';
import databaseConfig from './config/database.config';
import databaseConfigProd from './config/database.config.prod';
import { ExcerptLink } from './excerpt/entities/excerpt-link.entity';
import { ExcerptName } from './excerpt/entities/excerpt-name.entity';
import { Excerpt } from './excerpt/entities/excerpt.entity';
import { ExcerptModule } from './excerpt/excerpt.module';
import { ExcerptService } from './excerpt/excerpt.service';
import { History } from './history/entities/history.entity';
import { HistoryModule } from './history/history.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

/**
 * AppModule.
 *
 * @author dafengzhen
 */
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? databaseConfig : databaseConfigProd,
    }),
    TypeOrmModule.forFeature([User, Collection, Excerpt, ExcerptName, ExcerptLink, History]),
    AuthModule,
    UserModule,
    CollectionModule,
    ExcerptModule,
    HistoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    CollectionService,
    ExcerptService,
  ],
})
export class AppModule {}
