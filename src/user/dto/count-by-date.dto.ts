import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

/**
 * CountByDateDto,
 *
 * @author dafengzhen
 */
export class CountByDateDto {
  /**
   * pastDays.
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(90)
  pastDays: number;

  constructor(values?: Partial<CountByDateDto>) {
    Object.assign(this, values);
  }
}
