import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

/**
 * ExportCollectionDataDto,
 *
 * @author dafengzhen
 */
export class ExportCollectionDataDto {
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
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * sort.
   */
  @IsNotEmpty()
  @IsNumber()
  sort: number;

  /**
   * subset.
   */
  @IsArray()
  @Type(() => ExportCollectionDataDto)
  @ValidateNested({ each: true })
  subset: ExportCollectionDataDto[];

  /**
   * updateDate.
   */
  @IsNotEmpty()
  @IsString()
  updateDate: string;
}
