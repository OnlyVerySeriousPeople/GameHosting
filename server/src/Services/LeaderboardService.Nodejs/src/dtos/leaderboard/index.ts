import * as pb from '../../gen/proto/leaderboard/v1/types_pb';
import {LeaderboardShema} from '../../db';
import {create} from '@bufbuild/protobuf';
import {timestampFromDate} from '@bufbuild/protobuf/wkt';

const toFullEntry = (data: LeaderboardShema) => {
  const {gameId, playerId, score, custom, lastUpdatedAt} = data;
  return {
    gameId,
    playerId,
    entry: {
      lastUpdatedAt: timestampFromDate(lastUpdatedAt),
      stats: {score, custom},
    },
  };
};

export const toEntryDto = (data: LeaderboardShema): pb.Entry =>
  create(pb.EntrySchema, toFullEntry(data).entry);

export const toLeaderboardEntryDto = (
  data: LeaderboardShema,
): pb.LeaderboardEntry => {
  const {gameId, ...entry} = toFullEntry(data);

  return create(pb.LeaderboardEntrySchema, entry);
};

export const toPlayerStatsEntryDto = (
  data: LeaderboardShema,
): pb.PlayerStatsEntry => {
  const {playerId, ...entry} = toFullEntry(data);

  return create(pb.PlayerStatsEntrySchema, entry);
};
