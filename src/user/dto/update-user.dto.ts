import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto,
 *
 * @author dafengzhen
 */
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
  /**
   * avatar.
   */
  @IsOptional()
  @IsString()
  avatar: string;

  /**
   * newPassword.
   */
  @IsOptional()
  @IsString()
  newPassword?: string;

  /**
   * oldPassword.
   */
  @IsOptional()
  @IsString()
  oldPassword?: string;
}
