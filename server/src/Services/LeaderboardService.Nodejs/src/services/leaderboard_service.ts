import * as pb from '../gen/proto/leaderboard/v1/leaderboard_pb';
import {
  CheckReq,
  greaterThanZero,
  nonEmptyStr,
  plainObj,
} from '../dtos/validators';
import {Database, LeaderboardModel} from '../db';
import {
  toEntryDto,
  toLeaderboardEntryDto,
  toPlayerStatsEntryDto,
} from '../dtos/leaderboard';
import {HandleError} from './utils/handle_error';
import {LogEndpoint} from './utils/log_endpoint';
import {create} from '@bufbuild/protobuf';

export class LeaderboardService {
  private readonly model: LeaderboardModel;

  constructor({leaderboard}: Database) {
    this.model = leaderboard;
  }

  @LogEndpoint('GetLeaderboard')
  @HandleError('cannot get leaderboard of this game')
  @CheckReq<pb.GetLeaderboardRequest>(
    nonEmptyStr('gameId'),
    greaterThanZero('entryLimit'),
  )
  async getLeaderboard({
    gameId,
    entryLimit,
    scoreCursor,
  }: pb.GetLeaderboardRequest): Promise<pb.GetLeaderboardResponse> {
    const {entries, nextScoreCursor} = await this.model.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );

    return create(pb.GetLeaderboardResponseSchema, {
      entries: entries.map(entry => toLeaderboardEntryDto(entry)),
      nextScoreCursor,
    });
  }

  @LogEndpoint('DeleteLeaderboard')
  @HandleError('cannot delete leaderboard of this game')
  @CheckReq<pb.DeleteLeaderboardRequest>(nonEmptyStr('gameId'))
  async deleteLeaderboard({
    gameId,
  }: pb.DeleteLeaderboardRequest): Promise<pb.DeleteLeaderboardResponse> {
    await this.model.deleteLeaderboard(gameId);

    return create(pb.DeleteLeaderboardResponseSchema, {ok: true});
  }

  @LogEndpoint('UpdatePlayerStats')
  @HandleError('cannot update stats of this player for this game')
  @CheckReq<pb.UpdatePlayerStatsRequest>(
    nonEmptyStr('gameId', 'playerId'),
    plainObj('stats'),
  )
  async updatePlayerStats({
    gameId,
    playerId,
    stats,
  }: pb.UpdatePlayerStatsRequest): Promise<pb.UpdatePlayerStatsResponse> {
    await this.model.updatePlayerStats(
      gameId,
      playerId,
      stats!.score,
      stats!.custom,
    );

    return create(pb.UpdatePlayerStatsResponseSchema, {ok: true});
  }

  @LogEndpoint('GetPlayerStats')
  @HandleError('cannot get stats of this player for this game')
  @CheckReq<pb.GetPlayerStatsRequest>(nonEmptyStr('gameId', 'playerId'))
  async getPlayerStats({
    gameId,
    playerId,
  }: pb.GetPlayerStatsRequest): Promise<pb.GetPlayerStatsResponse> {
    const entry = await this.model.getPlayerStats(gameId, playerId);

    return create(pb.GetPlayerStatsResponseSchema, {
      entry: toEntryDto(entry),
    });
  }

  @LogEndpoint('GetAllPlayerStats')
  @HandleError('cannot get stats of this player')
  @CheckReq<pb.GetAllPlayerStatsRequest>(nonEmptyStr('playerId'))
  async getAllPlayerStats({
    playerId,
  }: pb.GetAllPlayerStatsRequest): Promise<pb.GetAllPlayerStatsResponse> {
    const entries = await this.model.getAllPlayerStats(playerId);

    return create(pb.GetAllPlayerStatsResponseSchema, {
      entries: entries.map(entry => toPlayerStatsEntryDto(entry)),
    });
  }

  @LogEndpoint('DeleteAllPlayerStats')
  @HandleError('cannot detete stats of this player')
  @CheckReq<pb.DeleteAllPlayerStatsRequest>(nonEmptyStr('playerId'))
  async deleteAllPlayerStats({
    playerId,
  }: pb.DeleteAllPlayerStatsRequest): Promise<pb.DeleteAllPlayerStatsResponse> {
    await this.model.deleteAllPlayerStats(playerId);

    return create(pb.DeleteAllPlayerStatsResponseSchema, {ok: true});
  }
}
