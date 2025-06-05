import {FilterQuery, Model, model} from 'mongoose';
import {LeaderboardShema, leaderboardShema} from '../schemas/leaderboard';
import {DatabaseError} from '../../errors';
import {methodDecoratorFactory} from '../../utils/method-decorator-factory';

const handleError = methodDecoratorFactory(err => {
  throw DatabaseError.from(err);
}, 'catch');

export class LeaderboardModel {
  private readonly model: Model<LeaderboardShema>;

  constructor() {
    this.model = model<LeaderboardShema>('Leaderboard', leaderboardShema);
  }

  @handleError
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

  @handleError
  async deleteLeaderboard(gameId: string) {
    await this.model.deleteMany({gameId});
  }

  @handleError
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

  @handleError
  async getPlayerStats(gameId: string, playerId: string) {
    const entry = await this.model.findOne({gameId, playerId}).lean();
    return entry as LeaderboardShema;
  }

  @handleError
  async getAllPlayerStats(playerId: string) {
    const entries = await this.model.find({playerId}).lean();
    return entries as LeaderboardShema[];
  }

  @handleError
  async deleteAllPlayerStats(playerId: string) {
    await this.model.deleteMany({playerId});
  }
}
