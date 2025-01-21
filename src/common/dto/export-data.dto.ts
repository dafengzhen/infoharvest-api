import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ExportCollectionDataDto } from './export-collection-data.dto';
import { ExportExcerptDataDto } from './export-excerpt-data.dto';
import { ExportUserDataDto } from './export-user-data.dto';

/**
 * ExportDataDto,
 *
 * @author dafengzhen
 */
export class ExportDataDto {
  /**
   * _export_date.
   */
  @IsNotEmpty()
  @IsString()
  _export_date: string;

  /**
   * _export_version.
   */
  @IsNotEmpty()
  @IsString()
  _export_version: string;

  /**
   * _type.
   */
  @IsNotEmpty()
  @IsString()
  _type: string;

  /**
   * collections.
   */
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => ExportCollectionDataDto)
  @ValidateNested({ each: true })
  collections: ExportCollectionDataDto[];

  /**
   * collections.
   */
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => ExportExcerptDataDto)
  @ValidateNested({ each: true })
  excerpts: ExportExcerptDataDto[];

  /**
   * user.
   */
  @IsNotEmpty()
  @Type(() => ExportUserDataDto)
  @ValidateNested()
  user: ExportUserDataDto;
}
