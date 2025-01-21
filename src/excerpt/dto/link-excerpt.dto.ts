import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * LinkExcerptDto,
 *
 * @author dafengzhen
 */
export class LinkExcerptDto {
  /**
   * deletionFlag.
   */
  @IsBoolean()
  @IsOptional()
  deletionFlag?: boolean;

  /**
   * id.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * link.
   */
  @IsOptional()
  @IsString()
  link?: string;
}
