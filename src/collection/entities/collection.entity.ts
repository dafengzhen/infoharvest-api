import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { User } from '../../user/entities/user.entity';

/**
 * Collection,
 *
 * @author dafengzhen
 */
@Entity()
export class Collection extends Base {
  /**
   * excerptCount.
   */
  excerptCount: number;

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.collection, {
    cascade: true,
  })
  excerpts: Excerpt[];

  /**
   * name.
   */
  @Column()
  @Index({
    fulltext: true,
    parser: 'ngram',
  })
  name: string;

  /**
   * parentSubset.
   */
  @ManyToOne(() => Collection, (collection) => collection.subset, {
    onDelete: 'CASCADE',
  })
  parentSubset: Collection;

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number;

  /**
   * subset.
   */
  @OneToMany(() => Collection, (collection) => collection.parentSubset, {
    cascade: true,
  })
  subset: Collection[];

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.collections, {
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(values?: Partial<Pick<Collection, 'id' | 'name' | 'sort'>>) {
    super();
    Object.assign(this, values);
  }
}
