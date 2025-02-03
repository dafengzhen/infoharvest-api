import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { SearchExcerptDto } from './dto/search-excerpt.dto';
import { Excerpt } from './entities/excerpt.entity';
import { ExcerptService } from './excerpt.service';

/**
 * ExcerptQueryController,
 *
 * @author dafengzhen
 */
@Controller('excerpts')
export class ExcerptQueryController {
  constructor(private readonly excerptService: ExcerptService) {}

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  async search(@Query() dto: SearchExcerptDto, @CurrentUser() currentUser: TCurrentUser): Promise<Excerpt[]> {
    return this.excerptService.search(dto, currentUser);
  }
}
