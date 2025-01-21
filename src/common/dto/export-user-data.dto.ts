import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * ExportUserDataDto,
 *
 * @author dafengzhen
 */
export class ExportUserDataDto {
  /**
   * avatar.
   */
  @IsOptional()
  @IsString()
  avatar: string;

  /**
   * createDate.
   */
  @IsNotEmpty()
  @IsString()
  createDate: string;

  /**
   /**
   * id.
   */
  @IsNotEmpty()
  @IsNumber()
  id: number;

  /**
   * updateDate.
   */
  @IsNotEmpty()
  @IsString()
  updateDate: string;

  /**
   * username.
   */
  @IsNotEmpty()
  @IsString()
  username: string;
}
