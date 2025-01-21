import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * NameExcerptDto,
 *
 * @author dafengzhen
 */
export class NameExcerptDto {
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
   * name.
   */
  @IsOptional()
  @IsString()
  name?: string;
}
