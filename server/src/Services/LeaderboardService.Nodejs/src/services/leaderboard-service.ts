import {
  DeleteAllPlayerStatsRequest,
  DeleteLeaderboardRequest,
  GetAllPlayerStatsRequest,
  GetLeaderboardRequest,
  GetPlayerStatsRequest,
  UpdatePlayerStatsRequest,
} from '../gen/proto/leaderboard/v1/leaderboard_pb';
import {DTO} from './utils/dto';
import {dateToTimestamp} from '../utils/date-to-timestamp';
import {db} from '../db';

export const leaderboardService = {
  async getLeaderboard({
    gameId,
    entryLimit,
    scoreCursor,
  }: GetLeaderboardRequest) {
    const {leaderboard} = await db();
    const {entries, nextScoreCursor} = await leaderboard.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );

    return {
      entries: entries.map(entry =>
        new DTO(entry)
          .excluded('gameId')
          .transform('lastUpdatedAt', dateToTimestamp),
      ),
      nextScoreCursor,
    };
  },

  async deleteLeaderboard({gameId}: DeleteLeaderboardRequest) {
    const {leaderboard} = await db();
    await leaderboard.deleteLeaderboard(gameId);
    return {ok: true};
  },

  async updatePlayerStats(req: UpdatePlayerStatsRequest) {
    const {
      gameId,
      playerId,
      stats: {score, custom},
    } = new DTO(req).requireAll();

    const {leaderboard} = await db();
    await leaderboard.updatePlayerStats(gameId, playerId, score, custom);

    return {ok: true};
  },

  async getPlayerStats({gameId, playerId}: GetPlayerStatsRequest) {
    const {leaderboard} = await db();
    const entry = await leaderboard.getPlayerStats(gameId, playerId);
    return {
      entry: new DTO(entry)
        .excluded('gameId', 'playerId')
        .transform('lastUpdatedAt', dateToTimestamp),
    };
  },

  async getAllPlayerStats({playerId}: GetAllPlayerStatsRequest) {
    const {leaderboard} = await db();
    const entries = await leaderboard.getAllPlayerStats(playerId);
    return {
      entries: entries.map(entry => new DTO(entry).exclude('playerId')),
    };
  },

  async deleteAllPlayerStats({playerId}: DeleteAllPlayerStatsRequest) {
    const {leaderboard} = await db();
    await leaderboard.deleteAllPlayerStats(playerId);
    return {ok: true};
  },
};
