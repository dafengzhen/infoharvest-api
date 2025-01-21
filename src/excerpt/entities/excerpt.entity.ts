import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Collection } from '../../collection/entities/collection.entity';
import { Base } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ExcerptLink } from './excerpt-link.entity';
import { ExcerptName } from './excerpt-name.entity';
import { ExcerptState } from './excerpt-state.entity';

/**
 * ExcerptStateEnum,
 */
export enum ExcerptStateEnum {
  INVALID = 'INVALID',
  UNCONFIRMED = 'UNCONFIRMED',
  VALID = 'VALID',
}

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
    onDelete: 'CASCADE',
  })
  collection: Collection;
  /**
   * description.
   */
  @Column({ default: null, type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  description: string;
  /**
   * enableHistoryLogging.
   */
  @Column({ default: false })
  enableHistoryLogging: boolean;
  /**
   * icon.
   */
  @Column({ default: null, type: 'text' })
  icon: string;
  /**
   * links.
   */
  @OneToMany(() => ExcerptLink, (excerptLink) => excerptLink.excerpt, {
    cascade: true,
  })
  links: ExcerptLink[];
  /**
   * names.
   */
  @OneToMany(() => ExcerptName, (excerptName) => excerptName.excerpt, {
    cascade: true,
  })
  names: ExcerptName[];
  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number;
  /**
   * states.
   */
  @OneToMany(() => ExcerptState, (excerptState) => excerptState.excerpt, {
    cascade: true,
  })
  states: ExcerptState[];
  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.excerpts, {
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(values?: Partial<Pick<Excerpt, 'description' | 'enableHistoryLogging' | 'icon' | 'sort'>>) {
    super();
    Object.assign(this, values);
  }
}
