import * as proto from '../../gen_proto';
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

export const toEntryDto = (data: LeaderboardShema): proto.Entry =>
  create(proto.EntrySchema, toFullEntry(data).entry);

export const toLeaderboardEntryDto = (
  data: LeaderboardShema,
): proto.LeaderboardEntry => {
  const {gameId, ...entry} = toFullEntry(data);

  return create(proto.LeaderboardEntrySchema, entry);
};

export const toPlayerStatsEntryDto = (
  data: LeaderboardShema,
): proto.PlayerStatsEntry => {
  const {playerId, ...entry} = toFullEntry(data);

  return create(proto.PlayerStatsEntrySchema, entry);
};
