import * as proto from './gen_proto';
import {ConnectRouter} from '@connectrpc/connect';
import {Database} from './db';
import {GameService} from './services/game_service';

export const routes = (db: Database) => (router: ConnectRouter) => {
  router.service(proto.GameService, new GameService(db));
};
