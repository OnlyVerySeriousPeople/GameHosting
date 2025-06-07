import {Kysely, PostgresDialect} from 'kysely';
import {DB} from '../gen_kysely';
import {DatabaseError} from '@game-hosting/common/errors';
import {GameModel} from './models/game';
import {Pool} from 'pg';

type Database = {game: GameModel};

let models: Database | undefined;

const connectToDatabase = async () => {
  if (models) return models;

  try {
    const url = process.env.DB_URL;
    if (!url) throw new DatabaseError('no PostgreSQL URL provided');

    const pool = new Pool({connectionString: url});
    const dialect = new PostgresDialect({pool});
    const db = new Kysely<DB>({dialect});

    models = {
      game: new GameModel(db),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new DatabaseError(`cannot connect to the database (${message})`);
  }

  return models;
};

export {connectToDatabase, Database, GameModel};
