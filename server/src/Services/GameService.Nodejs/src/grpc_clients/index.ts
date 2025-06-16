import {LeaderboardClient, leaderboardClient} from './leaderboard_client';

export * from './leaderboard_client';

export type GrpcClients = {leaderboardClient: LeaderboardClient};

export const grpcClients: GrpcClients = {leaderboardClient};
