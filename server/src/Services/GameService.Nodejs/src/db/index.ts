import {CamelCasePlugin, Kysely, PostgresDialect} from 'kysely';
import {DB} from '../gen_kysely';
import {DatabaseError} from '@game-hosting/common/errors';
import {GameModel} from './models/game';
import {Pool} from 'pg';

type DatabaseModels = {
  game: GameModel;
};

class Database {
  private static instance: Kysely<DB> | null = null;
  private static models: DatabaseModels | null = null;

  static async connect(): Promise<DatabaseModels> {
    if (this.models) return this.models;

    const url = process.env.DB_URL;
    if (!url) throw new DatabaseError('no PostgreSQL URL provided');

    try {
      this.instance = new Kysely<DB>({
        dialect: new PostgresDialect({pool: new Pool({connectionString: url})}),
        plugins: [new CamelCasePlugin()],
      });
      this.models = {
        game: new GameModel(this.instance),
      };

      return this.models;
    } catch (err) {
      throw DatabaseError.from(err, msg => `failed to connect: ${msg}`);
    }
  }

  static async disconnect() {
    if (!this.instance) return;

    try {
      await this.instance.destroy();
      this.instance = null;
      this.models = null;
    } catch (err) {
      throw DatabaseError.from(err, msg => `failed to disconnect: ${msg}`);
    }
  }
}

export {Database, DatabaseModels, GameModel};
