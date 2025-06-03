import {FilterQuery, Model, model} from 'mongoose';
import {LeaderboardShema, leaderboardShema} from '../schemas/leaderboard';

export class LeaderboardModel {
  private readonly model: Model<LeaderboardShema>;

  constructor() {
    this.model = model('Leaderboard', leaderboardShema);
  }

  async getLeaderboard(
    gameId: string,
    entryLimit: number,
    scoreCursor?: number,
  ) {
    const query: FilterQuery<LeaderboardShema> = {
      gameId,
    };
    if (scoreCursor !== undefined) {
      query.score = {$lt: scoreCursor};
    }

    const docs = await this.model
      .find(query)
      .sort({score: -1})
      .limit(entryLimit);

    return {
      exists: docs.length > 0,
      entries: docs.map(doc => ({
        playerId: doc.playerId,
        score: doc.score,
        custom: doc.custom,
      })),
      nextScoreCursor: docs[docs.length - 1]?.score,
    };
  }
}
