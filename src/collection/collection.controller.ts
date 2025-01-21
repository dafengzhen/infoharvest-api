import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { Response as Res } from 'express';

import { CurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { User } from '../user/entities/user.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { SearchCollectionDto } from './dto/search-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

/**
 * CollectionController,
 *
 * @author dafengzhen
 */
@Controller('collections')
export class CollectionController {
  private readonly logger = new Logger(CollectionController.name);

  constructor(private readonly collectionService: CollectionService) {
    this.logger.debug('CollectionController init');
  }

  @Delete(':id/cleanEmptySubsets')
  cleanEmptySubsets(@Param('id') id: number, @CurrentUser() user: User) {
    return this.collectionService.cleanEmptySubsets(+id, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Response() response: Res, @CurrentUser() user: User, @Body() createCollectionDto: CreateCollectionDto) {
    const collection = await this.collectionService.create(user, createCollectionDto);
    response.header('Location', `/collections/${collection.id}`).send();
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User, @Query() query: PaginationQueryDto) {
    return this.collectionService.findAll(user, query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.collectionService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.collectionService.remove(+id, user);
  }

  @Delete()
  removeAll(@CurrentUser() user: User) {
    return this.collectionService.removeAll(user);
  }

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  search(@CurrentUser() user: User, @Query() query: SearchCollectionDto) {
    return this.collectionService.search(user, query);
  }

  @Get('select')
  @UseInterceptors(ClassSerializerInterceptor)
  selectAll(@CurrentUser() user: User) {
    return this.collectionService.selectAll(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(+id, user, updateCollectionDto);
  }
}
