import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { CollectionService } from './collection.service';
import { SearchCollectionDto } from './dto/search-collection.dto';
import { Collection } from './entities/collection.entity';

/**
 * CollectionQueryController,
 *
 * @author dafengzhen
 */
@Controller('collections')
export class CollectionQueryController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  async search(@Query() dto: SearchCollectionDto, @CurrentUser() currentUser: TCurrentUser): Promise<Collection[]> {
    return this.collectionService.search(dto, currentUser);
  }
}
