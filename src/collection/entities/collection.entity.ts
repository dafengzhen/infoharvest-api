import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { User } from '../../user/entities/user.entity';
import { CustomConfig } from './custom-config';

/**
 * Collection,
 *
 * @author dafengzhen
 */
@Entity()
export class Collection extends Base {
  /**
   * children.
   */
  @OneToMany(() => Collection, (collection) => collection.parent, { cascade: true })
  children: Collection[];

  /**
   * customConfig.
   */
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.collection, { cascade: true })
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
   * order.
   */
  @Column({ default: 0 })
  order: number;

  /**
   * parent.
   */
  @ManyToOne(() => Collection, (collection) => collection.children, {
    onDelete: 'CASCADE',
  })
  parent: Collection;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.collections, {
    onDelete: 'CASCADE',
  })
  user: User;
}
