import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
   * locked.
   */
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  /**
   * type.
   */
  type = 'user' as const;

  /**
   * unlockPassword.
   */
  @IsBoolean()
  @IsString()
  unlockPassword?: string;

  /**
   * wallpaper.
   */
  @IsOptional()
  @IsString()
  wallpaper?: string;
}
