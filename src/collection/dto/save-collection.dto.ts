import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * SaveCollectionDto,
 *
 * @author dafengzhen
 */
export class SaveCollectionDto {
  /**
   * children.
   */
  @IsArray()
  @IsOptional()
  @Transform(({ value }: { value: SaveCollectionDto[] }) => {
    return Array.isArray(value)
      ? value.map(({ children: _children, ...rest }) => {
          void _children;
          return rest;
        })
      : value;
  })
  @Type(() => SaveCollectionDto)
  children?: Omit<SaveCollectionDto, 'children'>[];

  /**
   * id.
   */
  @IsNumber()
  @IsOptional()
  id?: number;

  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * order.
   */
  @IsNumber()
  @IsOptional()
  order?: number;
}
