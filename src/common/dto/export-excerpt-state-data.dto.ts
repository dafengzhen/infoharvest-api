/**
 * ExportExcerptStateDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptStateDataDto {
  /**
   * state.
   */
  state: string;

  constructor(values?: Partial<ExportExcerptStateDataDto>) {
    Object.assign(this, values);
  }
}
