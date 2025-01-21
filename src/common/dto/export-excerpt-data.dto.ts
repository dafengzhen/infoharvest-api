import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * ExportExcerptDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptDataDto {
  /**
   * collectionId.
   */
  @IsNumber()
  @IsOptional()
  collectionId?: number;

  /**
   * createDate.
   */
  @IsNotEmpty()
  @IsString()
  createDate: string;

  /**
   * description.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * enableHistoryLogging.
   */
  @IsBoolean()
  @IsNotEmpty()
  enableHistoryLogging: boolean;

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   /**
   * id.
   */
  @IsNotEmpty()
  @IsNumber()
  id: number;

  /**
   * links.
   */
  @IsArray()
  @Type(() => String)
  links: string[];

  /**
   * names.
   */
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => String)
  names: string[];

  /**
   * sort.
   */
  @IsNotEmpty()
  @IsNumber()
  sort: number;

  /**
   * states.
   */
  @IsArray()
  @Type(() => String)
  states: string[];

  /**
   * updateDate.
   */
  @IsNotEmpty()
  @IsString()
  updateDate: string;
}
