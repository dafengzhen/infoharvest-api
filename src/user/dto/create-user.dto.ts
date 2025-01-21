import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * CreateUserDto,
 *
 * @author dafengzhen
 */
export class CreateUserDto {
  /**
   * password.
   */
  @IsNotEmpty()
  @IsString()
  @Length(6, 18)
  password: string;

  /**
   * username.
   */
  @IsNotEmpty()
  @IsString()
  @Length(3, 15)
  username: string;

  constructor(values?: Partial<CreateUserDto>) {
    Object.assign(this, values);
  }
}
