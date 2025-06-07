import * as proto from '../gen_proto';
import {
  CheckReq,
  greaterThanZero,
  nonEmptyStr,
  plainObj,
} from '@game-hosting/common/dto_validators';
import {Database, LeaderboardModel} from '../db';
import {
  toEntryDto,
  toLeaderboardEntryDto,
  toPlayerStatsEntryDto,
} from '../dtos/leaderboard';
import {HandleError} from '@game-hosting/common/grpc_service_utils';
import {LogEndpoint} from '@game-hosting/common/grpc_service_utils';
import {create} from '@bufbuild/protobuf';

export class LeaderboardService {
  private readonly model: LeaderboardModel;

  constructor({leaderboard}: Database) {
    this.model = leaderboard;
  }

  @LogEndpoint('GetLeaderboard')
  @HandleError('cannot get leaderboard of this game')
  @CheckReq<proto.GetLeaderboardRequest>(
    nonEmptyStr('gameId'),
    greaterThanZero('entryLimit'),
  )
  async getLeaderboard({
    gameId,
    entryLimit,
    scoreCursor,
  }: proto.GetLeaderboardRequest): Promise<proto.GetLeaderboardResponse> {
    const {entries, nextScoreCursor} = await this.model.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );

    return create(proto.GetLeaderboardResponseSchema, {
      entries: entries.map(entry => toLeaderboardEntryDto(entry)),
      nextScoreCursor,
    });
  }

  @LogEndpoint('DeleteLeaderboard')
  @HandleError('cannot delete leaderboard of this game')
  @CheckReq<proto.DeleteLeaderboardRequest>(nonEmptyStr('gameId'))
  async deleteLeaderboard({
    gameId,
  }: proto.DeleteLeaderboardRequest): Promise<proto.DeleteLeaderboardResponse> {
    await this.model.deleteLeaderboard(gameId);

    return create(proto.DeleteLeaderboardResponseSchema, {ok: true});
  }

  @LogEndpoint('UpdatePlayerStats')
  @HandleError('cannot update stats of this player for this game')
  @CheckReq<proto.UpdatePlayerStatsRequest>(
    nonEmptyStr('gameId', 'playerId'),
    plainObj('stats'),
  )
  async updatePlayerStats({
    gameId,
    playerId,
    stats,
  }: proto.UpdatePlayerStatsRequest): Promise<proto.UpdatePlayerStatsResponse> {
    await this.model.updatePlayerStats(
      gameId,
      playerId,
      stats!.score,
      stats!.custom,
    );

    return create(proto.UpdatePlayerStatsResponseSchema, {ok: true});
  }

  @LogEndpoint('GetPlayerStats')
  @HandleError('cannot get stats of this player for this game')
  @CheckReq<proto.GetPlayerStatsRequest>(nonEmptyStr('gameId', 'playerId'))
  async getPlayerStats({
    gameId,
    playerId,
  }: proto.GetPlayerStatsRequest): Promise<proto.GetPlayerStatsResponse> {
    const entry = await this.model.getPlayerStats(gameId, playerId);

    return create(proto.GetPlayerStatsResponseSchema, {
      entry: toEntryDto(entry),
    });
  }

  @LogEndpoint('GetAllPlayerStats')
  @HandleError('cannot get stats of this player')
  @CheckReq<proto.GetAllPlayerStatsRequest>(nonEmptyStr('playerId'))
  async getAllPlayerStats({
    playerId,
  }: proto.GetAllPlayerStatsRequest): Promise<proto.GetAllPlayerStatsResponse> {
    const entries = await this.model.getAllPlayerStats(playerId);

    return create(proto.GetAllPlayerStatsResponseSchema, {
      entries: entries.map(entry => toPlayerStatsEntryDto(entry)),
    });
  }

  @LogEndpoint('DeleteAllPlayerStats')
  @HandleError('cannot detete stats of this player')
  @CheckReq<proto.DeleteAllPlayerStatsRequest>(nonEmptyStr('playerId'))
  async deleteAllPlayerStats({
    playerId,
  }: proto.DeleteAllPlayerStatsRequest): Promise<proto.DeleteAllPlayerStatsResponse> {
    await this.model.deleteAllPlayerStats(playerId);

    return create(proto.DeleteAllPlayerStatsResponseSchema, {ok: true});
  }
}
