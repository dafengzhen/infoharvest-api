import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptLink,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptLink extends Base {
  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.links, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  excerpt: Excerpt;

  /**
   * link.
   */
  @Column({ default: null, type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  link: string;
}
