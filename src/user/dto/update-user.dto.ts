import { IsOptional, IsString } from 'class-validator';

/**
 * UpdateUserDto,
 *
 * @author dafengzhen
 */
export class UpdateUserDto {
  /**
   * avatar.
   */
  @IsOptional()
  @IsString()
  avatar?: string;
}
