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
import {Database} from '../db';
import {LeaderboardModel} from '../db/models/leaderboard';
import {handleError} from './utils/handle_error';
import {logEndpoint} from './utils/log_endpoint';

export class LeaderboardService {
  private readonly model: LeaderboardModel;

  constructor({leaderboard}: Database) {
    this.model = leaderboard;
  }

  @logEndpoint('GetLeaderboard')
  @handleError('cannot get leaderboard of this game')
  async getLeaderboard(
    @check<GetLeaderboardReq>(
      nonEmptyStr('gameId'),
      greaterThanZero('entryLimit'),
    )
    {gameId, entryLimit, scoreCursor}: GetLeaderboardReq,
  ) {
    const {entries, nextScoreCursor} = await this.model.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );

    return {
      entries: entries.map(entry => dtos.leaderboardEntry(entry)),
      nextScoreCursor,
    };
  }

  @logEndpoint('DeleteLeaderboard')
  @handleError('cannot delete leaderboard of this game')
  async deleteLeaderboard(
    @check<DeleteLeaderboardReq>(nonEmptyStr('gameId'))
    {gameId}: DeleteLeaderboardReq,
  ) {
    await this.model.deleteLeaderboard(gameId);
    return {ok: true};
  }

  @logEndpoint('UpdatePlayerStats')
  @handleError('cannot update stats of this player for this game')
  async updatePlayerStats(
    @check<UpdatePlayerStatsReq>(
      nonEmptyStr('gameId', 'playerId'),
      plainObj('stats'),
    )
    {gameId, playerId, stats}: UpdatePlayerStatsReq,
  ) {
    await this.model.updatePlayerStats(
      gameId,
      playerId,
      stats!.score,
      stats!.custom,
    );

    return {ok: true};
  }

  @logEndpoint('GetPlayerStats')
  @handleError('cannot get stats of this player for this game')
  async getPlayerStats(
    @check<GetPlayerStatsReq>(nonEmptyStr('gameId', 'playerId'))
    {gameId, playerId}: GetPlayerStatsReq,
  ) {
    const entry = await this.model.getPlayerStats(gameId, playerId);
    return {
      entry: dtos.entry(entry),
    };
  }

  @logEndpoint('GetAllPlayerStats')
  @handleError('cannot get stats of this player')
  async getAllPlayerStats(
    @check<GetAllPlayerStatsReq>(nonEmptyStr('playerId'))
    {playerId}: GetAllPlayerStatsReq,
  ) {
    const entries = await this.model.getAllPlayerStats(playerId);
    return {
      entries: entries.map(entry => dtos.playerStatsEntry(entry)),
    };
  }

  @logEndpoint('DeleteAllPlayerStats')
  @handleError('cannot detete stats of this player')
  async deleteAllPlayerStats(
    @check<DeleteAllPlayerStatsReq>(nonEmptyStr('playerId'))
    {playerId}: DeleteAllPlayerStatsReq,
  ) {
    await this.model.deleteAllPlayerStats(playerId);
    return {ok: true};
  }
}
