import {FilterQuery, Model, model} from 'mongoose';
import {LeaderboardShema, leaderboardShema} from '../schemas/leaderboard';
import {HandleError} from '@game-hosting/common/db_model_utils';
import {LeaderboardModel} from './types';

export class MongoLeaderboardModel implements LeaderboardModel {
  private readonly model: Model<LeaderboardShema>;

  constructor() {
    this.model = model<LeaderboardShema>('Leaderboard', leaderboardShema);
  }

  @HandleError
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

  @HandleError
  async deleteLeaderboard(gameId: string) {
    await this.model.deleteMany({gameId});
  }

  @HandleError
  async updatePlayerStats(
    gameId: string,
    playerId: string,
    newScore: number,
    newCustom?: Object,
  ) {
    await this.model.findOneAndUpdate(
      {gameId, playerId},
      {
        $max: {score: newScore},
        $set: newCustom ? {custom: newCustom} : undefined,
      },
      {upsert: true, new: true},
    );
  }

  @HandleError
  async getPlayerStats(gameId: string, playerId: string) {
    const entry = await this.model.findOne({gameId, playerId}).lean();
    return entry as LeaderboardShema;
  }

  @HandleError
  async getAllPlayerStats(playerId: string) {
    const entries = await this.model.find({playerId}).lean();
    return entries as LeaderboardShema[];
  }

  @HandleError
  async deleteAllPlayerStats(playerId: string) {
    await this.model.deleteMany({playerId});
  }
}
