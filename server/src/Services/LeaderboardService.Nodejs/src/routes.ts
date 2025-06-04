import * as proto from './gen/proto/leaderboard/v1/leaderboard_pb';
import {ConnectRouter} from '@connectrpc/connect';
import {LeaderboardService} from './services/leaderboard-service';

export const routes = (router: ConnectRouter) => {
  router.service(proto.LeaderboardService, new LeaderboardService());
};
