import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Collection } from '../../collection/entities/collection.entity';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { CustomConfig } from './custom-config';

/**
 * User,
 *
 * @author dafengzhen
 */
@Entity()
export class User extends Base {
  /**
   * avatar.
   */
  @Column({ default: null, type: 'text' })
  avatar: string;

  /**
   * collections.
   */
  @OneToMany(() => Collection, (collection) => collection.user, { cascade: true })
  collections: Collection[];

  /**
   * customConfig.
   */
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.user, { cascade: true })
  excerpts: Excerpt[];

  /**
   * password.
   */
  @Column()
  @Exclude()
  @IsNotEmpty()
  password: string;

  /**
   * username.
   */
  @Column({ unique: true })
  @IsNotEmpty()
  username: string;
}
