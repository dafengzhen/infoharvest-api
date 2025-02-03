import type { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigExcerptDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigExcerptDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  type = 'excerpt' as const;
}
