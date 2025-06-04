import {JsonObject} from '@bufbuild/protobuf';
import {Timestamp} from '../types';

export type Stats = {
  score: number;
  custom?: JsonObject;
};

export type Entry = {
  lastUpdatedAt: Timestamp;
  stats: Stats;
};

export type FullEntry = {
  gameId: string;
  playerId: string;
  entry: Entry;
};

export type LeaderboardEntry = Omit<FullEntry, 'gameId'>;

export type PlayerStatsEntry = Omit<FullEntry, 'playerId'>;
