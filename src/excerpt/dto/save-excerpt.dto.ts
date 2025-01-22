import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

import { SaveExcerptLinkDto } from './save-excerpt-link.dto';
import { SaveExcerptNameDto } from './save-excerpt-name.dto';

/**
 * SaveExcerptDto,
 *
 * @author dafengzhen
 */
export class SaveExcerptDto {
  /**
   * collectionId.
   */
  @IsNumber()
  @IsOptional()
  collectionId?: number;

  /**
   * description.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   * id.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * links.
   */
  @IsArray()
  @IsOptional()
  @Type(() => SaveExcerptLinkDto)
  links?: SaveExcerptLinkDto[];

  /**
   * names.
   */
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => SaveExcerptNameDto)
  names: SaveExcerptNameDto[];

  /**
   * order.
   */
  @IsNumber()
  @IsOptional()
  order?: number;
}
