import * as dtos from '../dtos/leaderboard';
import {
  DeleteAllPlayerStatsReq,
  DeleteLeaderboardReq,
  GetAllPlayerStatsReq,
  GetLeaderboardReq,
  GetPlayerStatsReq,
  UpdatePlayerStatsReq,
} from '../dtos/leaderboard/requests';
import {
  check,
  greaterThanZero,
  nonEmptyStr,
  plainObj,
} from '../dtos/validators';
import {db} from '../db';

export class LeaderboardService {
  async getLeaderboard(
    @check<GetLeaderboardReq>(
      nonEmptyStr('gameId'),
      greaterThanZero('entryLimit'),
    )
    {gameId, entryLimit, scoreCursor}: GetLeaderboardReq,
  ) {
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

  async deleteLeaderboard(
    @check<DeleteLeaderboardReq>(nonEmptyStr('gameId'))
    {gameId}: DeleteLeaderboardReq,
  ) {
    const {leaderboard} = await db();
    await leaderboard.deleteLeaderboard(gameId);
    return {ok: true};
  }

  async updatePlayerStats(
    @check<UpdatePlayerStatsReq>(
      nonEmptyStr('gameId', 'playerId'),
      plainObj('stats'),
    )
    {gameId, playerId, stats}: UpdatePlayerStatsReq,
  ) {
    const {leaderboard} = await db();
    await leaderboard.updatePlayerStats(
      gameId,
      playerId,
      stats!.score,
      stats!.custom,
    );

    return {ok: true};
  }

  async getPlayerStats(
    @check<GetPlayerStatsReq>(nonEmptyStr('gameId', 'playerId'))
    {gameId, playerId}: GetPlayerStatsReq,
  ) {
    const {leaderboard} = await db();
    const entry = await leaderboard.getPlayerStats(gameId, playerId);
    return {
      entry: dtos.entry(entry),
    };
  }

  async getAllPlayerStats(
    @check<GetAllPlayerStatsReq>(nonEmptyStr('playerId'))
    {playerId}: GetAllPlayerStatsReq,
  ) {
    const {leaderboard} = await db();
    const entries = await leaderboard.getAllPlayerStats(playerId);
    return {
      entries: entries.map(entry => dtos.playerStatsEntry(entry)),
    };
  }

  async deleteAllPlayerStats(
    @check<DeleteAllPlayerStatsReq>(nonEmptyStr('playerId'))
    {playerId}: DeleteAllPlayerStatsReq,
  ) {
    const {leaderboard} = await db();
    await leaderboard.deleteAllPlayerStats(playerId);
    return {ok: true};
  }
}
