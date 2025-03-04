import type { ICustomConfig } from '../../common/interface/custom-config';

/**
 * CustomizationSettings.
 *
 * @author dafengzhen
 */
export class CustomConfig implements ICustomConfig {
  /**
   * type.
   */
  type = 'collection' as const;
}
