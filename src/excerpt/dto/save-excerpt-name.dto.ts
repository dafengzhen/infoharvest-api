import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SaveExcerptNameDto,
 *
 * @author dafengzhen
 */
export class SaveExcerptNameDto {
  /**
   * id.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * name.
   */
  @IsString()
  name: string;
}
