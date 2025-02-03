import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { CollectionService } from './collection.service';
import { SaveCollectionDto } from './dto/save-collection.dto';
import { SearchCollectionDto } from './dto/search-collection.dto';
import { UpdateCustomConfigCollectionDto } from './dto/update-custom-config-collection.dto';
import { Collection } from './entities/collection.entity';

/**
 * CollectionController,
 *
 * @author dafengzhen
 */
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async query(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Collection> {
    return this.collectionService.query(+id, currentUser);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async queryAll(
    @Query() dto: PaginationQueryDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<Collection[] | IPagination<Collection>> {
    return this.collectionService.queryAll(dto, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser) {
    return this.collectionService.remove(+id, currentUser);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async save(
    @Body() saveCollectionDto: SaveCollectionDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<Collection> {
    return this.collectionService.save(saveCollectionDto, currentUser);
  }

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  async search(@Query() dto: SearchCollectionDto, @CurrentUser() currentUser: TCurrentUser): Promise<Collection[]> {
    return this.collectionService.search(dto, currentUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigCollectionDto: UpdateCustomConfigCollectionDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.collectionService.updateCustomConfig(+id, updateCustomConfigCollectionDto, currentUser);
  }
}
