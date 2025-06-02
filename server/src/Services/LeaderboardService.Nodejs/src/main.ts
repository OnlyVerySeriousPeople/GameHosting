import {
  FilterQuery,
  InferSchemaType,
  Schema,
  SchemaTypes,
  connect,
  model,
} from 'mongoose';
import {
  GetLeaderboardRequest,
  LeaderboardService,
} from './gen/proto/leaderboard/v1/leaderboard_pb';
import Fastify from 'fastify';
import {env} from 'process';
import {fastifyConnectPlugin} from '@connectrpc/connect-fastify';

const leaderboardShema = new Schema(
  {
    gameId: {type: String, required: true},
    playerId: {type: String, required: true},
    score: {type: Number, required: true},
    custom: {type: SchemaTypes.Mixed},
  },
  {
    timestamps: {createdAt: false, updatedAt: 'lastUpdatedAt'},
  },
);
type LeaderboardType = InferSchemaType<typeof leaderboardShema>;

const Leaderboard = model('Leaderboard', leaderboardShema);

void connect(env.DB_URL!);

const leaderboardService = {
  async getLeaderboard({
    gameId,
    entryLimit,
    scoreCursor,
  }: GetLeaderboardRequest) {
    const query: FilterQuery<LeaderboardType> = {
      gameId,
    };
    if (scoreCursor !== undefined) {
      query.score = {$lt: scoreCursor};
    }

    const result = await Leaderboard.find(query)
      .sort({score: -1})
      .limit(entryLimit);

    return {
      exists: result.length > 0,
      entries: result.map(doc => ({
        playerId: doc.playerId,
        score: doc.score,
        custom: doc.custom,
      })),
      nextScoreCursor: result[result.length - 1]?.score,
    };
  },
};

const server = Fastify();

void server.register(fastifyConnectPlugin, {
  routes: router => {
    router.service(LeaderboardService, leaderboardService);
  },
});

server.listen({host: env.HOST, port: Number(env.PORT)}, (err, address) => {
  if (err) console.error(err);
  console.log(`Server running at ${address}`);
});
