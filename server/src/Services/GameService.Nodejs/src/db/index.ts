import {CamelCasePlugin, Kysely, PostgresDialect} from 'kysely';
import {DB} from '../gen_kysely';
import {DatabaseError} from '@game-hosting/common/errors';
import {GameModel} from './models/game';
import {Pool} from 'pg';

export * from './models/game';

export type Database = {game: GameModel};

let models: Database | undefined;

export const connectToDatabase = async () => {
  if (models) return models;

  try {
    const url = process.env.DB_URL;
    if (!url) throw new DatabaseError('no PostgreSQL URL provided');

    const pool = new Pool({connectionString: url});
    const db = new Kysely<DB>({
      dialect: new PostgresDialect({pool}),
      plugins: [new CamelCasePlugin()],
    });

    models = {
      game: new GameModel(db),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new DatabaseError(`cannot connect to the database (${message})`);
  }

  return models;
};
