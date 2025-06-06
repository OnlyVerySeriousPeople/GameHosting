import {DatabaseError} from '@game-hosting/common/errors';
import {LeaderboardModel} from './models/leaderboard';
import {LeaderboardShema} from './schemas/leaderboard';
import {connect} from 'mongoose';

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

export {connectToDatabase, Database, LeaderboardShema, LeaderboardModel};
