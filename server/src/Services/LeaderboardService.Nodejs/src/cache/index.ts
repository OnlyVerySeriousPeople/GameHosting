import {RedisClientType, createClient} from 'redis';
import {CachedLeaderboardModel} from './models/leaderboard';
import {DatabaseModels} from '../db';
import {InternalError} from '@game-hosting/common/errors';

const wrapDatabase = async (client: RedisClientType) => {
  const {default: superjson} = await import('superjson');

  return ({leaderboard, ...rest}: DatabaseModels): DatabaseModels => ({
    ...rest,
    leaderboard: new CachedLeaderboardModel(client, leaderboard, superjson),
  });
};

export class Cache {
  private static client: RedisClientType | null = null;

  static async connect() {
    if (this.client?.isReady) {
      return {
        client: this.client,
        wrapDatabase: await wrapDatabase(this.client),
      };
    }

    const url = process.env.CACHE_URL;
    if (!url) throw new InternalError('no Redis URL provided');

    try {
      this.client = createClient({url});
      await this.client.connect();

      return {
        client: this.client,
        wrapDatabase: await wrapDatabase(this.client),
      };
    } catch (err) {
      throw InternalError.from(
        err,
        msg => `failed to connect to Redis: ${msg}`,
      );
    }
  }

  static async disconnect() {
    if (!this.client?.isReady) return;

    try {
      await this.client.quit();
      this.client = null;
    } catch (err) {
      throw InternalError.from(
        err,
        msg => `failed to disconnect from Redis: ${msg}`,
      );
    }
  }
}
