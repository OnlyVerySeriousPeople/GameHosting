import {ConnectOptions, connect} from 'mongoose';
import {LeaderboardModel} from './models/leaderboard';

export type Database = {leaderboard: LeaderboardModel};

let models: Database | undefined;

export const connectToDb = async () => {
  if (models) return models;

  try {
    const url = process.env.DB_URL;
    if (!url) throw Error('No MongoDB URL provided.');

    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    models = {
      leaderboard: new LeaderboardModel(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Cannot connect to the database. ${message}`);
  }

  return models;
};
