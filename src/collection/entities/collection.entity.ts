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
  @OneToMany(() => Collection, (collection) => collection.parent)
  children: Collection[];

  /**
   * customConfig.
   */
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.collection)
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
    cascade: true,
    onDelete: 'CASCADE',
  })
  parent: Collection;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.collections, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
