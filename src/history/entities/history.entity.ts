import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Collection } from '../../collection/entities/collection.entity';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { User } from '../../user/entities/user.entity';

/**
 * History,
 *
 * @author dafengzhen
 */
@Entity()
export class History extends Base {
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
   * excerpt.
   */
  @ManyToOne(() => Excerpt)
  excerpt: Excerpt;

  /**
   * links.
   */
  @Column({ type: 'json' })
  hLinks: string[];

  /**
   * names.
   */
  @Column({ type: 'json' })
  hNames: string[];

  /**
   * states.
   */
  @Column({ type: 'json' })
  hStates: string[];

  /**
   * icon.
   */
  @Column({ default: null, type: 'text' })
  icon: string;

  /**
   * sort.
   */
  @Column({ default: 0 })
  sort: number;

  /**
   * user.
   */
  @ManyToOne(() => User, (user) => user.excerpts, {
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(values?: Partial<Excerpt>) {
    super();
    if (values) {
      if (values.description) {
        this.description = values.description;
      }
      if (values.icon) {
        this.icon = values.icon;
      }
      if (values.sort) {
        this.sort = values.sort;
      }
      if (values.enableHistoryLogging) {
        this.enableHistoryLogging = values.enableHistoryLogging;
      }
      if (values.user) {
        this.user = values.user;
      }
      if (values.collection) {
        this.collection = values.collection;
      }
      if (values.names) {
        this.hNames = values.names.map((value) => value.name);
      }
      if (values.links) {
        this.hLinks = values.links.map((value) => value.link);
      }
      if (values.states) {
        this.hStates = values.states.map((value) => value.state);
      }

      this.excerpt = values as Excerpt;
    }
  }
}
