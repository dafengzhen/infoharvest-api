import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { CustomConfig } from './custom-config';

/**
 * History,
 *
 * @author dafengzhen
 */
@Entity()
export class History extends Base {
  /**
   * customConfig.
   */
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * description.
   */
  @Column({ default: null, type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  description: string;

  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.histories, { cascade: true, onDelete: 'CASCADE' })
  excerpt: Excerpt;

  /**
   * icon.
   */
  @Column({ default: null, type: 'text' })
  icon: string;

  /**
   * links.
   */
  @Column({ type: 'json' })
  links: string[];

  /**
   * names.
   */
  @Column({ type: 'json' })
  names: string[];

  /**
   * order.
   */
  @Column({ default: 0 })
  order: number;
}
