/**
 * SelectCollectionDto,
 *
 * @author dafengzhen
 */
export class SelectCollectionDto {
  /**
   * excerptCount.
   */
  excerptCount?: number;
  /**
   * id.
   */
  id: number;
  /**
   * name.
   */
  name: string;
  /**
   * subset.
   */
  subset: SelectCollectionDto[];

  constructor(values?: Partial<SelectCollectionDto>) {
    Object.assign(this, values);
  }
}
