import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SaveExcerptLinkDto,
 *
 * @author dafengzhen
 */
export class SaveExcerptLinkDto {
  /**
   * id.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * link.
   */
  @IsString()
  link: string;
}
