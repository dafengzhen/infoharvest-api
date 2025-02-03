import type { MigrationInterface, QueryRunner } from 'typeorm';

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * init infoharvest.
 *
 * @author dafengzhen
 */
export class Infoharvest1737470033282 implements MigrationInterface {
  public async down(): Promise<void> {
    console.log('There is nothing to restore, if necessary consider deleting the database and starting over');
    return Promise.resolve();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = readFileSync(join(__dirname, '../resource/ddl/v1_0__init.sql'), {
      encoding: 'utf8',
    });

    await queryRunner.query(query);
  }
}
