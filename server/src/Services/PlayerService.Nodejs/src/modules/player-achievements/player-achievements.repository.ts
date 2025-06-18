import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class PlayerAchievementsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findPlayerAchievements(playerId: number) {
    return this.db.playerAchievement.findMany({
      where: { playerId },
      include: { achievement: true },
    });
  }

  async findPlayerAchievement(playerId: number, achievementId: number) {
    return this.db.playerAchievement.findUnique({
      where: {
        playerId_achievementId: {
          playerId,
          achievementId,
        },
      },
    });
  }

  async createPlayerAchievement(playerId: number, achievementId: number) {
    return this.db.playerAchievement.create({
      data: {
        player: { connect: { id: playerId } },
        achievement: { connect: { id: achievementId } },
      },
    });
  }

  async findAchievementsByStatTarget(stat: string) {
    return this.db.achievement.findMany({
      where: { statTarget: stat },
    });
  }
}
