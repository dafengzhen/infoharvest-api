import type { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigCollectionDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigCollectionDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  type = 'collection' as const;
}
