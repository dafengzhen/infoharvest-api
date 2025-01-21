import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { CreateCollectionDto } from './create-collection.dto';
import { SubsetCollectionDto } from './subset-collection.dto';

/**
 * UpdateCollectionDto,
 *
 * @author dafengzhen
 */
export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  /**
   * sort.
   */
  @IsNumber()
  @IsOptional()
  sort?: number;

  /**
   * subset.
   */
  @IsArray()
  @IsOptional()
  @Type(() => SubsetCollectionDto)
  @ValidateNested({ each: true })
  subset?: SubsetCollectionDto[];
}
