import {defineConfig} from 'kysely-ctl';
import {Pool} from 'pg';
import * as path from 'node:path';

const KYSELY_FOLDER = 'kysely';

export default defineConfig({
  dialect: 'pg',
  dialectConfig: {
    pool: new Pool({connectionString: process.env.DB_URL}),
  },
  migrations: {
    migrationFolder: path.join(KYSELY_FOLDER, 'migrations'),
  },
  seeds: {
    seedFolder: path.join(KYSELY_FOLDER, 'seeds'),
  },
});
