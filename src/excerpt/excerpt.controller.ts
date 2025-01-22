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

import type { IPagination } from '../common/interface/pagination';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { SaveExcerptDto } from './dto/save-excerpt.dto';
import { SearchExcerptDto } from './dto/search-excerpt.dto';
import { UpdateCustomConfigExcerptDto } from './dto/update-custom-config-excerpt.dto';
import { ValidateLinkRequestDto } from './dto/validate-link-request.dto';
import { Excerpt } from './entities/excerpt.entity';
import { ExcerptService } from './excerpt.service';
import { ValidateLinkResponseVo } from './vo/validate-link-response.vo';

/**
 * ExcerptController,
 *
 * @author dafengzhen
 */
@Controller('excerpts')
export class ExcerptController {
  constructor(private readonly excerptService: ExcerptService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query() dto: PaginationQueryExcerptDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<Excerpt[] | IPagination<Excerpt>> {
    return this.excerptService.findAll(dto, currentUser);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async save(@Body() saveExcerptDto: SaveExcerptDto, @CurrentUser() currentUser: TCurrentUser): Promise<Excerpt> {
    return this.excerptService.save(saveExcerptDto, currentUser);
  }

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  async search(@Query() dto: SearchExcerptDto, @CurrentUser() currentUser: TCurrentUser): Promise<Excerpt[]> {
    return this.excerptService.search(dto, currentUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigExcerptDto: UpdateCustomConfigExcerptDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.excerptService.updateCustomConfig(+id, updateCustomConfigExcerptDto, currentUser);
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-link')
  @UseInterceptors(ClassSerializerInterceptor)
  async validateLink(@Body() validateLinkRequestDto: ValidateLinkRequestDto): Promise<ValidateLinkResponseVo[]> {
    return this.excerptService.validateLink(validateLinkRequestDto);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<Excerpt> {
    return this.excerptService.findOne(+id, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.excerptService.remove(+id, currentUser);
  }
}
