import {Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('game_category')
    .asEnum(['ACTION', 'PUZZLE', 'STRATEGY', 'SPORTS', 'RACING'])
    .execute();

  await db.schema
    .createTable('game')
    .addColumn('id', 'uuid', col =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('author_id', 'uuid', col => col.notNull())
    .addColumn('name', 'varchar(255)', col => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('categories', sql`game_category[]`)
    .addColumn('icon_url', 'varchar(512)')
    .addColumn('uploaded_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('total_plays_count', 'integer', col =>
      col.notNull().defaultTo(0),
    )
    .execute();

  await db.schema
    .createIndex('idx_game_author_id')
    .on('game')
    .column('author_id')
    .execute();

  await db.schema
    .createIndex('idx_game_categories')
    .on('game')
    .using('gin')
    .column('categories')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('game').execute();
  await db.schema.dropType('game_category').execute();
}
