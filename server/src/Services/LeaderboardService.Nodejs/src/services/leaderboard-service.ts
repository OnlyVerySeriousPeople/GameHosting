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
import {handleError} from './utils/handle-error';

export class LeaderboardService {
  @handleError('cannot get leaderboard of this game')
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

    return {
      entries: entries.map(entry => dtos.leaderboardEntry(entry)),
      nextScoreCursor,
    };
  }

  @handleError('cannot delete leaderboard of this game')
  async deleteLeaderboard(
    @check<DeleteLeaderboardReq>(nonEmptyStr('gameId'))
    {gameId}: DeleteLeaderboardReq,
  ) {
    const {leaderboard} = await db();
    await leaderboard.deleteLeaderboard(gameId);
    return {ok: true};
  }

  @handleError('cannot update stats of this player for this game')
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

  @handleError('cannot get stats of this player for this game')
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

  @handleError('cannot get stats of this player')
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

  @handleError('cannot detete stats of this player')
  async deleteAllPlayerStats(
    @check<DeleteAllPlayerStatsReq>(nonEmptyStr('playerId'))
    {playerId}: DeleteAllPlayerStatsReq,
  ) {
    const {leaderboard} = await db();
    await leaderboard.deleteAllPlayerStats(playerId);
    return {ok: true};
  }
}
