import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Collection } from '../../collection/entities/collection.entity';
import { Base } from '../../common/entities/base.entity';
import { Excerpt } from '../../excerpt/entities/excerpt.entity';
import { History } from '../../history/entities/history.entity';
import { CustomizationSettings } from './customization-settings';

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
  @Column({ default: null })
  avatar: string;

  /**
   * collections.
   */
  @OneToMany(() => Collection, (collection) => collection.user, {
    cascade: true,
  })
  collections: Collection[];

  /**
   * customizationSettings.
   */
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();

  /**
   * example.
   */
  @Column({ default: false })
  example: boolean;

  /**
   * excerpts.
   */
  @OneToMany(() => Excerpt, (excerpt) => excerpt.user)
  excerpts: Excerpt[];

  /**
   * histories.
   */
  @OneToMany(() => History, (history) => history.user, { cascade: ['remove'] })
  histories: History[];

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

  constructor(
    values?: Partial<Pick<User, 'avatar' | 'createDate' | 'example' | 'id' | 'password' | 'updateDate' | 'username'>>,
  ) {
    super();
    Object.assign(this, values);
  }
}
