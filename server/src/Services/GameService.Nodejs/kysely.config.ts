import * as path from 'node:path';
import {CamelCasePlugin} from 'kysely';
import {Pool} from 'pg';
import {defineConfig} from 'kysely-ctl';

const KYSELY_FOLDER = 'kysely';

export default defineConfig({
  dialect: 'pg',
  dialectConfig: {
    pool: new Pool({connectionString: process.env.DB_URL}),
  },
  plugins: [new CamelCasePlugin()],
  migrations: {
    migrationFolder: path.join(KYSELY_FOLDER, 'migrations'),
  },
  seeds: {
    seedFolder: path.join(KYSELY_FOLDER, 'seeds'),
  },
});
