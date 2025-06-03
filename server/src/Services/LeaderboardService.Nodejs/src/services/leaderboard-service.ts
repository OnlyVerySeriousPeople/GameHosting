import {GetLeaderboardRequest} from '../gen/proto/leaderboard/v1/leaderboard_pb';
import {db} from '../db';

export const leaderboardService = {
  async getLeaderboard({
    gameId,
    entryLimit,
    scoreCursor,
  }: GetLeaderboardRequest) {
    return (await db())!.leaderboard.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );
  },
};
