/**
 * ExportExcerptLinkDataDto,
 *
 * @author dafengzhen
 */
export class ExportExcerptLinkDataDto {
  /**
   * link.
   */
  link: string;

  constructor(values?: Partial<ExportExcerptLinkDataDto>) {
    Object.assign(this, values);
  }
}
