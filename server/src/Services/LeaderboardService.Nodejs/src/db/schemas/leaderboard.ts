import {InferSchemaType, Schema} from 'mongoose';

const leaderboardShema = new Schema(
  {
    gameId: {type: String, required: true},
    playerId: {type: String, required: true},
    score: {type: Number, required: true},
    custom: {type: Object},
  },
  {
    timestamps: {createdAt: false, updatedAt: 'lastUpdatedAt'},
  },
);
type LeaderboardShema = InferSchemaType<typeof leaderboardShema> & {
  lastUpdatedAt: Date;
};

export {leaderboardShema, LeaderboardShema};
