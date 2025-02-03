import type { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigHistoryDto,
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigHistoryDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  type = 'history' as const;
}
