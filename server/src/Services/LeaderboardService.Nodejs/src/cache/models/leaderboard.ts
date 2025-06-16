import {LeaderboardModel} from '../../db';
import {RedisClientType} from 'redis';

const CACHE_TTL = 600; // 10 minutes

const leaderboardCacheKeys = (gameId: string) => `leaderboard:${gameId}:*`;

const leaderboardPageCacheKey = (
  gameId: string,
  entryLimit: number,
  scoreCursor?: number,
) => `leaderboard:${gameId}:${entryLimit}:${scoreCursor ?? 'null'}`;

const allPlayerStatsCacheKey = (playerId: string) =>
  `allPlayerStats:${playerId}`;

export class CachedLeaderboardModel implements LeaderboardModel {
  constructor(
    private readonly client: RedisClientType,
    private readonly realModel: LeaderboardModel,
    private readonly parser: {
      parse: <T = unknown>(str: string) => T;
      stringify: (data: unknown) => string;
    },
  ) {}

  async getLeaderboard(
    gameId: string,
    entryLimit: number,
    scoreCursor?: number,
  ) {
    const key = leaderboardPageCacheKey(gameId, entryLimit, scoreCursor);

    const cached = await this.client.get(key);
    if (cached)
      return this.parser.parse<ReturnType<LeaderboardModel['getLeaderboard']>>(
        cached,
      );

    const data = await this.realModel.getLeaderboard(
      gameId,
      entryLimit,
      scoreCursor,
    );
    await this.client.set(key, this.parser.stringify(data), {
      expiration: {type: 'EX', value: CACHE_TTL},
    });
    return data;
  }

  async deleteLeaderboard(gameId: string) {
    await this.realModel.deleteLeaderboard(gameId);

    const keys = await this.client.keys(leaderboardCacheKeys(gameId));
    if (keys.length > 0) await this.client.del(keys);
  }

  async getPlayerStats(
    ...args: Parameters<LeaderboardModel['getPlayerStats']>
  ) {
    return this.realModel.getPlayerStats(...args);
  }

  async updatePlayerStats(
    ...args: Parameters<LeaderboardModel['updatePlayerStats']>
  ) {
    return this.realModel.updatePlayerStats(...args);
  }

  async getAllPlayerStats(playerId: string) {
    const key = allPlayerStatsCacheKey(playerId);

    const cached = await this.client.get(key);
    if (cached)
      return this.parser.parse<
        ReturnType<LeaderboardModel['getAllPlayerStats']>
      >(cached);

    const data = await this.realModel.getAllPlayerStats(playerId);
    await this.client.set(key, this.parser.stringify(data), {
      expiration: {type: 'EX', value: CACHE_TTL},
    });
    return data;
  }

  async deleteAllPlayerStats(playerId: string) {
    await this.realModel.deleteAllPlayerStats(playerId);

    await this.client.del(allPlayerStatsCacheKey(playerId));
  }
}
