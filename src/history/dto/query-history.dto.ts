import { IsNumber, IsOptional } from 'class-validator';

/**
 * QueryHistoryDto
 *
 * @author dafengzhen
 */
export class QueryHistoryDto {
  /**
   * excerptId.
   */
  @IsNumber()
  @IsOptional()
  excerptId?: number;
}
