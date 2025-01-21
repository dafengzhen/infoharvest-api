/**
 * ExportExcerptNameDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptNameDataDto {
  /**
   * name.
   */
  name: string;

  constructor(values?: Partial<ExportExcerptNameDataDto>) {
    Object.assign(this, values);
  }
}
