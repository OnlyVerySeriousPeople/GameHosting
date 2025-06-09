import * as proto from './gen_proto';
import {ConnectRouter} from '@connectrpc/connect';
import {DatabaseModels} from './db';
import {GameService} from './services/game_service';

export const routes = (models: DatabaseModels) => (router: ConnectRouter) => {
  router.service(proto.GameService, new GameService(models));
};
