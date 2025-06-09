import {DatabaseError} from '@game-hosting/common/errors';
import {LeaderboardModel} from './models/leaderboard';
import {LeaderboardShema} from './schemas/leaderboard';
import mongoose, {connect} from 'mongoose';

type Database = {leaderboard: LeaderboardModel};

let models: Database | undefined;

const connectToDatabase = async () => {
  if (models) return models;

  try {
    const url = process.env.DB_URL;
    if (!url) throw new DatabaseError('no MongoDB URL provided');

    await connect(url);
    models = {
      leaderboard: new LeaderboardModel(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new DatabaseError(`cannot connect to the database (${message})`);
  }

  return models;
};

const closeDatabaseConnection = async () => {
  try {
    if (mongoose.connection.readyState === 0) return;
    await mongoose.connection.close();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new DatabaseError(`failed to close database connection (${message})`);
  }
};

export {
  connectToDatabase,
  closeDatabaseConnection,
  Database,
  LeaderboardShema,
  LeaderboardModel,
};
