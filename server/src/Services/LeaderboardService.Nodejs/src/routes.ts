import * as proto from './gen_proto';
import {ConnectRouter} from '@connectrpc/connect';
import {DatabaseModels} from './db';
import {LeaderboardService} from './services/leaderboard_service';

export const routes = (models: DatabaseModels) => (router: ConnectRouter) => {
  router.service(proto.LeaderboardService, new LeaderboardService(models));
};
