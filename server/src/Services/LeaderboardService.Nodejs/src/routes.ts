import {ConnectRouter} from '@connectrpc/connect';
import {LeaderboardService} from './gen/proto/leaderboard/v1/leaderboard_pb';
import {leaderboardService} from './services/leaderboard-service';

export const routes = (router: ConnectRouter) => {
  router.service(LeaderboardService, leaderboardService);
};
