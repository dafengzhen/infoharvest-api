import { IsNotEmpty, IsString } from 'class-validator';

/**
 * SearchExcerptDto,
 *
 * @author dafengzhen
 */
export class SearchExcerptDto {
  /**
   * name.
   */
  @IsNotEmpty()
  @IsString()
  name: string;
}
