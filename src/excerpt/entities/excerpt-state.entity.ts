import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from './excerpt.entity';

/**
 * ExcerptState,
 *
 * @author dafengzhen
 */
@Entity()
export class ExcerptState extends Base {
  /**
   * excerpt.
   */
  @ManyToOne(() => Excerpt, (excerpt) => excerpt.states, {
    onDelete: 'CASCADE',
  })
  excerpt: Excerpt;
  /**
   * state.
   */
  @Column()
  @Index({ fulltext: true, parser: 'ngram' })
  state: string;

  constructor(values?: Partial<ExcerptState>) {
    super();
    Object.assign(this, values);
  }
}
