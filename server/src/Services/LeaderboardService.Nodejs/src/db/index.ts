import mongoose, {connect} from 'mongoose';
import {DatabaseError} from '@game-hosting/common/errors';
import {LeaderboardModel} from './models/leaderboard';
import {LeaderboardShema} from './schemas/leaderboard';

type DatabaseModels = {leaderboard: LeaderboardModel};

class Database {
  private static models: DatabaseModels | null = null;

  static async connect(): Promise<DatabaseModels> {
    if (this.models) return this.models;

    const url = process.env.DB_URL;
    if (!url) throw new DatabaseError('no MongoDB URL provided');

    try {
      await connect(url);

      this.models = {
        leaderboard: new LeaderboardModel(),
      };

      return this.models;
    } catch (err) {
      throw DatabaseError.from(err, msg => `failed to connect: ${msg}`);
    }
  }

  static async disconnect() {
    if (mongoose.connection.readyState === 0) return;

    try {
      await mongoose.connection.close();
      this.models = null;
    } catch (err) {
      throw DatabaseError.from(err, msg => `failed to disconnect: ${msg}`);
    }
  }
}

export {Database, DatabaseModels, LeaderboardShema, LeaderboardModel};
