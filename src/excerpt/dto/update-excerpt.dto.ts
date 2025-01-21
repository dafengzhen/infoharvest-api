import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';

import { CreateExcerptDto } from './create-excerpt.dto';
import { LinkExcerptDto } from './link-excerpt.dto';
import { NameExcerptDto } from './name-excerpt.dto';
import { StateExcerptDto } from './state-excerpt.dto';

export class UpdateExcerptDto extends PartialType(OmitType(CreateExcerptDto, ['names', 'links', 'states'] as const)) {
  /**
   * deleteCollection.
   */
  @IsBoolean()
  @IsOptional()
  deleteCollection?: boolean;

  /**
   * links.
   */
  @IsArray()
  @IsOptional()
  @Type(() => LinkExcerptDto)
  @ValidateNested({ each: true })
  links: LinkExcerptDto[];

  /**
   * names.
   */
  @IsArray()
  @IsOptional()
  @Type(() => NameExcerptDto)
  @ValidateNested({ each: true })
  names: NameExcerptDto[];

  /**
   * states.
   */
  @IsArray()
  @IsOptional()
  @Type(() => StateExcerptDto)
  @ValidateNested({ each: true })
  states: StateExcerptDto[];
}
