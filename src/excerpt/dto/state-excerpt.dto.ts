import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * StateExcerptDto,
 *
 * @author dafengzhen
 */
export class StateExcerptDto {
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
   * state.
   */
  @IsOptional()
  @IsString()
  state?: string;
}
