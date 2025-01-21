import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * CreateCollectionDto,
 *
 * @author dafengzhen
 */
export class CreateCollectionDto {
  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * subsetNames.
   */
  @IsArray()
  @IsOptional()
  @Type(() => String)
  subsetNames: string[];

  constructor(values?: Partial<CreateCollectionDto>) {
    Object.assign(this, values);
  }
}
