import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Collection } from '../../collection/entities/collection.entity';
import { Base } from '../../common/entities/base.entity';
import { History } from '../../history/entities/history.entity';
import { User } from '../../user/entities/user.entity';
import { CustomConfig } from './custom-config';
import { ExcerptLink } from './excerpt-link.entity';
import { ExcerptName } from './excerpt-name.entity';

/**
 * Excerpt,
 *
 * @author dafengzhen
 */
@Entity()
export class Excerpt extends Base {
  /**
   * collection.
   */
  @ManyToOne(() => Collection, (collection) => collection.excerpts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  collection: Collection;

  /**
   * customConfig.
   */
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * darkIcon.
   */
  @Column({ default: null, type: 'text' })
  darkIcon: string;

  /**
   * description.
   */
  @Column({ default: null, type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  description: string;

  /**
   * histories.
   */
  @OneToMany(() => History, (history) => history.excerpt)
  histories: History[];

  /**
   * icon.
   */
  @Column({ default: null, type: 'text' })
  icon: string;

  /**
   * links.
   */
  @OneToMany(() => ExcerptLink, (excerptLink) => excerptLink.excerpt)
  links: ExcerptLink[];

  /**
   * names.
   */
  @OneToMany(() => ExcerptName, (excerptName) => excerptName.excerpt)
  names: ExcerptName[];

  /**
   * order.
   */
  @Column({ default: 0 })
  order: number;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.excerpts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
