import {env} from 'process';
import fastify from 'fastify';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';
import {routes} from './routes';

void (async () => {
  const server = fastify();

  await server.register(fastifyConnectPlugin, {routes});

  server.listen({host: env.HOST, port: Number(env.PORT)}, (err, address) => {
    if (err) console.error(err);
    console.log(`Server running at ${address}`);
  });
})();
