import * as proto from './gen_proto';
import {ConnectRouter} from '@connectrpc/connect';
import {DatabaseModels} from './db';
import {GameService} from './services/game_service';
import {GrpcClients} from './grpc_clients';

export const routes =
  (models: DatabaseModels, clients: GrpcClients) => (router: ConnectRouter) => {
    router.service(proto.GameService, new GameService(models, clients));
  };
