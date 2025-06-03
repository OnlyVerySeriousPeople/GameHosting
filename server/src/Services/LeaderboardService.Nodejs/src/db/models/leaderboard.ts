import {FilterQuery, Mixed, Model, model} from 'mongoose';
import {LeaderboardShema, leaderboardShema} from '../schemas/leaderboard';

export class LeaderboardModel {
  private readonly model: Model<LeaderboardShema>;

  constructor() {
    this.model = model<LeaderboardShema>('Leaderboard', leaderboardShema);
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

    const entries = await this.model
      .find(query)
      .sort({score: -1})
      .limit(entryLimit)
      .lean();

    return {
      entries: entries as LeaderboardShema[],
      nextScoreCursor: entries[entries.length - 1]?.score,
    };
  }

  async deleteLeaderboard(gameId: string) {
    await this.model.deleteMany({gameId});
  }

  async updatePlayerStats(
    gameId: string,
    playerId: string,
    newScore: number,
    newCustom: Mixed,
  ) {
    await this.model.findOneAndUpdate(
      {gameId, playerId},
      {
        $max: {score: newScore},
        $set: {custom: newCustom},
      },
      {upsert: true, new: true},
    );
  }

  async getPlayerStats(gameId: string, playerId: string) {
    const entry = await this.model.findOne({gameId, playerId}).lean();
    return entry as LeaderboardShema;
  }

  async getAllPlayerStats(playerId: string) {
    const entries = await this.model.find({playerId}).lean();
    return entries as LeaderboardShema[];
  }

  async deleteAllPlayerStats(playerId: string) {
    await this.model.deleteMany({playerId});
  }
}
