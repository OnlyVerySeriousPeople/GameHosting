import {
  DeleteAllPlayerStatsRequest,
  DeleteLeaderboardRequest,
  GetAllPlayerStatsRequest,
  GetLeaderboardRequest,
  GetPlayerStatsRequest,
  UpdatePlayerStatsRequest,
} from '../../gen/proto/leaderboard/v1/leaderboard_pb';
import {FromMessage} from '../types';

export type GetLeaderboardReq = FromMessage<GetLeaderboardRequest>;

export type DeleteLeaderboardReq = FromMessage<DeleteLeaderboardRequest>;

export type UpdatePlayerStatsReq = FromMessage<UpdatePlayerStatsRequest>;

export type GetPlayerStatsReq = FromMessage<GetPlayerStatsRequest>;

export type GetAllPlayerStatsReq = FromMessage<GetAllPlayerStatsRequest>;

export type DeleteAllPlayerStatsReq = FromMessage<DeleteAllPlayerStatsRequest>;
