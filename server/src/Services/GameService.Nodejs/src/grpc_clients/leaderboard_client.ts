import {Client, createClient} from '@connectrpc/connect';
import {LeaderboardService} from '../gen_proto';
import {createGrpcTransport} from '@connectrpc/connect-node';

const transport = createGrpcTransport({
  baseUrl: String(process.env.LEADERBOARD_URL),
});

export type LeaderboardClient = Client<typeof LeaderboardService>;

export const leaderboardClient = createClient(LeaderboardService, transport);
