import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SubsetCollectionDto,
 *
 * @author dafengzhen
 */
export class SubsetCollectionDto {
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

  /**
   * sort.
   */
  @IsNumber()
  @IsOptional()
  sort?: number;
}
