import {CloseCode} from './types';
import {MatchManager} from './match_manager';
import {env} from 'process';
import fastify from 'fastify';
import {logger} from '@game-hosting/common/utils';
import websocketPlugin from '@fastify/websocket';

void (async () => {
  const server = fastify();
  const matchManager = new MatchManager();

  await server.register(websocketPlugin);

  server.get('/', {websocket: true}, (socket, req) => {
    const {gameId, playerId} = req.query as {gameId: string; playerId: string};
    if (typeof gameId !== 'string' || typeof playerId !== 'string') {
      socket.close(CloseCode.UnsupportedData);
    }

    logger.debug(`player ${playerId} connected`);

    const match = matchManager.getOrCreateMatch(gameId);
    match.addPlayer(playerId, socket);

    socket.on('message', (msg: string) => {
      logger.debug(`received from player ${playerId}:`, msg);
      match.handleMessage(playerId, msg);
    });

    socket.on('close', () => {
      logger.debug(`player ${playerId} disconnected`);
      match.removePlayer(playerId);
    });
  });

  server.addHook('onClose', () => {
    logger.info('releasing resources...');
    matchManager.destroy();
    logger.info('shutting down...');
  });

  server.listen({host: env.HOST, port: Number(env.PORT)}, (err, addr) => {
    if (err) logger.error(err);
    else logger.info(`server runnnig at ${addr}`);
  });
})();
