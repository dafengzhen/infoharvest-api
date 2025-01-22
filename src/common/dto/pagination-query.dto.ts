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
   * page.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  page?: number;
}
