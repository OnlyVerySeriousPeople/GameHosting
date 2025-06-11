import {LeaderboardService} from '../gen_proto';
import {createClient} from '@connectrpc/connect';
import {createGrpcTransport} from '@connectrpc/connect-node';

const transport = createGrpcTransport({
  baseUrl: String(process.env.LEADERBOARD_URL),
});

export const leaderboardClient = createClient(LeaderboardService, transport);
