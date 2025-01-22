import { IsOptional, IsString } from 'class-validator';

/**
 * UpdateCustomConfigUserDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigUserDto {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * wallpaper.
   */
  @IsOptional()
  @IsString()
  wallpaper?: string;
}
