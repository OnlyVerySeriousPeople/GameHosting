import * as dtos from '../dtos/leaderboard';
import {
  DeleteAllPlayerStatsReq,
  DeleteLeaderboardReq,
  GetAllPlayerStatsReq,
  GetLeaderboardReq,
  GetPlayerStatsReq,
  UpdatePlayerStatsReq,
} from '../dtos/leaderboard/requests';
import {greaterThanZero, nonEmptyStr, nonNullObj} from '../dtos/validators';
import {db} from '../db';

export class LeaderboardService {
  @nonEmptyStr<GetLeaderboardReq>('gameId')
  @greaterThanZero<GetLeaderboardReq>('entryLimit')
  async getLeaderboard({gameId, entryLimit, scoreCursor}: GetLeaderboardReq) {
    const {leaderboard} = await db();
    const {entries, nextScoreCursor} = await leaderboard.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );

    console.log(entries);

    return {
      entries: entries.map(entry => dtos.leaderboardEntry(entry)),
      nextScoreCursor,
    };
  }

  @nonEmptyStr<DeleteLeaderboardReq>('gameId')
  async deleteLeaderboard({gameId}: DeleteLeaderboardReq) {
    const {leaderboard} = await db();
    await leaderboard.deleteLeaderboard(gameId);
    return {ok: true};
  }

  @nonEmptyStr<UpdatePlayerStatsReq>('gameId', 'playerId')
  @nonNullObj<UpdatePlayerStatsReq>('stats')
  async updatePlayerStats(req: UpdatePlayerStatsReq) {
    const {gameId, playerId, stats} = req;

    const {leaderboard} = await db();
    await leaderboard.updatePlayerStats(
      gameId,
      playerId,
      stats!.score,
      stats!.custom,
    );

    return {ok: true};
  }

  @nonEmptyStr<GetPlayerStatsReq>('gameId', 'playerId')
  async getPlayerStats({gameId, playerId}: GetPlayerStatsReq) {
    const {leaderboard} = await db();
    const entry = await leaderboard.getPlayerStats(gameId, playerId);
    return {
      entry: dtos.entry(entry),
    };
  }

  @nonEmptyStr<GetAllPlayerStatsReq>('playerId')
  async getAllPlayerStats({playerId}: GetAllPlayerStatsReq) {
    const {leaderboard} = await db();
    const entries = await leaderboard.getAllPlayerStats(playerId);
    return {
      entries: entries.map(entry => dtos.playerStatsEntry(entry)),
    };
  }

  @nonEmptyStr<DeleteAllPlayerStatsReq>('playerId')
  async deleteAllPlayerStats({playerId}: DeleteAllPlayerStatsReq) {
    const {leaderboard} = await db();
    await leaderboard.deleteAllPlayerStats(playerId);
    return {ok: true};
  }
}
