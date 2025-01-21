import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional } from 'class-validator';

/**
 * CheckLinkValidityDto,
 *
 * @author dafengzhen
 */
export class CheckLinkValidityDto {
  /**
   * headers.
   */
  @IsObject()
  @IsOptional()
  headers: Record<string, string>;

  /**
   * links.
   */
  @IsArray()
  @IsOptional()
  @Type(() => String)
  links: string[];
}
