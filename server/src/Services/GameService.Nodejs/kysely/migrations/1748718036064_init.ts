import {Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('gameCategory')
    .asEnum(['ACTION', 'PUZZLE', 'STRATEGY', 'SPORTS', 'RACING'])
    .execute();

  await db.schema
    .createTable('game')
    .addColumn('id', 'uuid', col =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('authorId', 'uuid', col => col.notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('categories', sql`gameCategory[]`)
    .addColumn('iconUrl', 'varchar(512)')
    .addColumn('uploadedAt', 'timestamptz', col =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('totalPlaysCount', 'integer', col => col.notNull().defaultTo(0))
    .execute();

  await db.schema
    .createIndex('idxGameAuthorId')
    .on('game')
    .column('authorId')
    .execute();

  await db.schema
    .createIndex('idxGameCategories')
    .on('game')
    .using('gin')
    .column('categories')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('game').execute();
  await db.schema.dropType('gameCategory').execute();
}
