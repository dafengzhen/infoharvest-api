import { IsNumber, IsOptional, IsPositive } from 'class-validator';

/**
 * PaginationQueryDto.
 *
 * @author dafengzhen
 */
export class PaginationQueryDto {
  /**
   * limit.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  limit?: number;

  /**
   * offset.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  offset?: number;

  /**
   * page.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  page?: number;

  /**
   * size.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  size?: number;
}
