import {env} from 'process';
import fastify from 'fastify';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';
import {logger} from './utils/logger';
import {routes} from './routes';

void (async () => {
  const server = fastify();

  await server.register(fastifyConnectPlugin, {routes});

  server.listen({host: env.HOST, port: Number(env.PORT)}, (err, addr) => {
    if (err) logger.error(err);
    else logger.info(`server running at ${addr}`);
  });
})();
