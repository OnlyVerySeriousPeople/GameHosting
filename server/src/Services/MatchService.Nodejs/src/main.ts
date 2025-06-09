import fastify from 'fastify';
import {logger} from '@game-hosting/common/utils';
import websocketPlugin from '@fastify/websocket';

void (async () => {
  const server = fastify();

  await server.register(websocketPlugin);

  server.get('/ws', {websocket: true}, conn => {
    logger.debug('client connected');

    conn.socket.on('message', (msg: string) => {
      logger.debug('received:', msg.toString());
      conn.socket.send(`echo: ${msg}`);
    });

    conn.socket.on('close', () => {
      logger.debug('client disconnected');
    });
  });

  server.listen({port: 8080}, (err, addr) => {
    if (err) logger.error(err);
    else logger.info(`server runnnig at ${addr}`);
  });
})();
