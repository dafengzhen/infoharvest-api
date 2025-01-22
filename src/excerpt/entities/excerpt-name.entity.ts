import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptName,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptName extends Base {
  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.names, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  excerpt: Excerpt;

  /**
   * name.
   */
  @Column()
  @Index({ fulltext: true, parser: 'ngram' })
  name: string;
}
