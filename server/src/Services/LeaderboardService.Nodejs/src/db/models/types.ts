import {LeaderboardShema} from '../schemas/leaderboard';

export interface LeaderboardModel {
  getLeaderboard(
    gameId: string,
    entryLimit: number,
    scoreCursor?: number,
  ): Promise<{entries: LeaderboardShema[]; nextScoreCursor: number}>;

  deleteLeaderboard(gameId: string): Promise<void>;

  updatePlayerStats(
    gameId: string,
    playerId: string,
    newScore: number,
    newCustom?: Object,
  ): Promise<void>;

  getPlayerStats(gameId: string, playerId: string): Promise<LeaderboardShema>;

  getAllPlayerStats(playerId: string): Promise<LeaderboardShema[]>;

  deleteAllPlayerStats(playerId: string): Promise<void>;
}
