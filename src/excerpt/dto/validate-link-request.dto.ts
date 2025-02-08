import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsObject, IsOptional } from 'class-validator';

/**
 * ValidateLinkRequestDto,
 *
 * @author dafengzhen
 */
export class ValidateLinkRequestDto {
  /**
   * headers.
   */
  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  /**
   * links.
   */
  @ArrayNotEmpty()
  @IsArray()
  @Type(() => String)
  links: string[];
}
