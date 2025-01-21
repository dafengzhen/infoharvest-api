import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

/**
 * Base,
 *
 * @author dafengzhen
 */
export abstract class Base {
  /**
   * createDate.
   */
  @CreateDateColumn()
  createDate: string;

  /**
   * deleteDate.
   */
  @DeleteDateColumn()
  @Exclude()
  deleteDate: string;

  /**
   * id.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * updateDate.
   */
  @UpdateDateColumn()
  updateDate: string;

  /**
   * version.
   */
  @Exclude()
  @VersionColumn()
  version: number;

  protected constructor(partial?: Partial<Base>) {
    Object.assign(this, partial);
  }
}
