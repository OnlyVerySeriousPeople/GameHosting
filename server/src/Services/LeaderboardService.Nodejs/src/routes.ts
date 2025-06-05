import * as proto from './gen/proto/leaderboard/v1/leaderboard_pb';
import {ConnectRouter} from '@connectrpc/connect';
import {Database} from './db';
import {LeaderboardService} from './services/leaderboard-service';

export const routes = (db: Database) => (router: ConnectRouter) => {
  router.service(proto.LeaderboardService, new LeaderboardService(db));
};
