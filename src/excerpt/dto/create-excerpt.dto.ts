import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * CreateExcerptDto,
 *
 * @author dafengzhen
 */
export class CreateExcerptDto {
  /**
   * collectionId.
   */
  @IsNumber()
  @IsOptional()
  collectionId: number;

  /**
   * description.
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * enableHistoryLogging.
   */
  @IsBoolean()
  @IsOptional()
  enableHistoryLogging: boolean;

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon: string;

  /**
   * links.
   */
  @IsArray()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  sort: number;

  /**
   * states.
   */
  @IsArray()
  @IsOptional()
  @Type(() => String)
  states: string[];
}
