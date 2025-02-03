import { IsOptional, IsString } from 'class-validator';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigUserDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigUserDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  type = 'user' as const;

  /**
   * wallpaper.
   */
  @IsOptional()
  @IsString()
  wallpaper?: string;
}
