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
import { User } from '../user/entities/user.entity';
import { CheckLinkValidityDto } from './dto/check-link-validity.dto';
import { CreateExcerptDto } from './dto/create-excerpt.dto';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { SearchExcerptDto } from './dto/search-excerpt.dto';
import { UpdateExcerptDto } from './dto/update-excerpt.dto';
import { ExcerptService } from './excerpt.service';

/**
 * ExcerptController,
 *
 * @author dafengzhen
 */
@Controller('excerpts')
export class ExcerptController {
  private readonly logger = new Logger(ExcerptController.name);

  constructor(private readonly excerptService: ExcerptService) {
    this.logger.debug('ExcerptController init');
  }

  @Post('check-link-validity')
  async checkLinkValidity(@Body() checkLinkValidityDto: CheckLinkValidityDto) {
    return this.excerptService.checkLinkValidity(checkLinkValidityDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Response() response: Res, @CurrentUser() user: User, @Body() createExcerptDto: CreateExcerptDto) {
    const excerpt = await this.excerptService.create(user, createExcerptDto);
    response.header('Location', `/excerpts/${excerpt.id}`).send();
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUser() user: User, @Query() query: PaginationQueryExcerptDto) {
    return this.excerptService.findAll(user, query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.excerptService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.excerptService.remove(+id, user);
  }

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  search(@CurrentUser() user: User, @Query() query: SearchExcerptDto) {
    return this.excerptService.search(user, query);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateExcerptDto: UpdateExcerptDto) {
    return this.excerptService.update(+id, user, updateExcerptDto);
  }
}
