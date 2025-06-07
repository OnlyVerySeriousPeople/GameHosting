import {DB, GameCategory} from './gen_kysely';
import {GameService, GetGameCategoriesRequest} from './gen_proto';
import {Kysely, PostgresDialect, sql} from 'kysely';
import Fastify from 'fastify';
import {Pool} from 'pg';
import {env} from 'process';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';

const pool = new Pool({connectionString: process.env.DB_URL});
const db = new Kysely<DB>({dialect: new PostgresDialect({pool})});

const gameService = {
  async getGameCategories(req: GetGameCategoriesRequest) {
    if (req.onlyUsed) {
      const result = await db
        .selectFrom(
          db
            .selectFrom('game')
            .select(sql`unnest(categories)`.as('category'))
            .where('categories', 'is not', null)
            .as('unnested'),
        )
        .select('category')
        .distinct()
        .execute();
      return {categories: result.map(row => row.category as string)};
    }

    return {categories: Object.values(GameCategory)};
  },
};

const server = Fastify();

void server.register(fastifyConnectPlugin, {
  routes: router => {
    router.service(GameService, gameService);
  },
});

server.listen({host: env.HOST, port: Number(env.PORT)}, (err, address) => {
  if (err) console.error(err);
  console.log(`Server running at ${address}`);
});
