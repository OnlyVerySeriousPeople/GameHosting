import {Entry, FullEntry, LeaderboardEntry, PlayerStatsEntry} from './types';
import {LeaderboardShema} from '../../db/schemas/leaderboard';
import {dateToTimestamp} from '../../utils/date-to-timestamp';

function fullEntry(data: LeaderboardShema): FullEntry {
  const {gameId, playerId, score, custom, lastUpdatedAt} = data;
  return {
    gameId,
    playerId,
    entry: {
      lastUpdatedAt: dateToTimestamp(lastUpdatedAt),
      stats: {score, custom},
    },
  };
}

export function entry(data: LeaderboardShema): Entry {
  return fullEntry(data).entry;
}

export function leaderboardEntry(data: LeaderboardShema): LeaderboardEntry {
  const {gameId, ...entry} = fullEntry(data);
  return entry;
}

export function playerStatsEntry(data: LeaderboardShema): PlayerStatsEntry {
  const {playerId, ...entry} = fullEntry(data);
  return entry;
}
