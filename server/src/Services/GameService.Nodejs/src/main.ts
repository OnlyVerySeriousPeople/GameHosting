import {connectToDatabase} from './db';
import {env} from 'process';
import fastify from 'fastify';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';
import {logger} from '@game-hosting/common/utils';
import {routes} from './routes';

void (async () => {
  const server = fastify();
  const db = await connectToDatabase();

  await server.register(fastifyConnectPlugin, {routes: routes(db)});

  server.listen({host: env.HOST, port: Number(env.PORT)}, (err, addr) => {
    if (err) logger.error(err);
    else logger.info(`server runnnig at ${addr}`);
  });
})();
