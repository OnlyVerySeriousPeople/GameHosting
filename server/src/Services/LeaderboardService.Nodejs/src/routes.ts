import * as proto from './gen_proto';
import {ConnectRouter} from '@connectrpc/connect';
import {Database} from './db';
import {LeaderboardService} from './services/leaderboard_service';

export const routes = (db: Database) => (router: ConnectRouter) => {
  router.service(proto.LeaderboardService, new LeaderboardService(db));
};
