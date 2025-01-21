import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * IBookmarkDto,
 *
 * @author dafengzhen
 */
export class IBookmarkDto {
  /**
   * addDate.
   */
  @IsOptional()
  @IsString()
  addDate: string;

  /**
   * href.
   */
  @IsNotEmpty()
  @IsString()
  href: string;

  /**
   * icon.
   */
  @IsOptional()
  @IsString()
  icon: string;

  /**
   * lastModified.
   */
  @IsOptional()
  @IsString()
  lastModified: string;

  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;
}

/**
 * ImportBookmarkDataDto,
 *
 * @author dafengzhen
 */
export class ImportBookmarkDataDto {
  /**
   * addDate.
   */
  @IsOptional()
  @IsString()
  addDate: string;

  /**
   * bookmarks.
   */
  @IsArray()
  @IsOptional()
  @Type(() => IBookmarkDto)
  @ValidateNested()
  bookmarks: IBookmarkDto[];

  /**
   * children.
   */
  @IsArray()
  @IsOptional()
  @Type(() => ImportBookmarkDataDto)
  @ValidateNested()
  children: ImportBookmarkDataDto[];

  /**
   * lastModified.
   */
  @IsOptional()
  @IsString()
  lastModified: string;

  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * personalToolbarFolder.
   */
  @IsOptional()
  @IsString()
  personalToolbarFolder: string;
}
