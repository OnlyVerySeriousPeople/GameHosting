import {ConnectOptions, connect} from 'mongoose';
import {LeaderboardModel} from './models/leaderboard';

let models: {leaderboard: LeaderboardModel} | undefined;

export const db = async () => {
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
