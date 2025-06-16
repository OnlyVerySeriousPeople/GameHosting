import {Cache} from './cache';
import {Database} from './db';
import {env} from 'process';
import fastify from 'fastify';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';
import {logger} from '@game-hosting/common/utils';
import {routes} from './routes';

void (async () => {
  const server = fastify({http2: true});
  const db = await Database.connect();
  const cache = await Cache.connect();

  await server.register(fastifyConnectPlugin, {
    routes: routes(cache.wrapDatabase(db)),
  });

  server.addHook('onClose', async () => {
    logger.info('closing database connection...');
    await Database.disconnect();
    logger.info('shutting down...');
  });

  server.listen({host: env.HOST, port: Number(env.PORT)}, (err, addr) => {
    if (err) logger.error(err);
    else logger.info(`server running at ${addr}`);
  });
})();
