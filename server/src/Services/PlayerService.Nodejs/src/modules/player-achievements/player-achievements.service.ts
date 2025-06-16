import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GetAllPlayerAchievementsRequest,
  GetAllPlayerAchievementsResponse,
  GetPlayerAchievementProgressRequest,
  GetPlayerAchievementProgressResponse,
} from '@proto/types';
import { PlayerStatisticsService } from '../player-statistics/player-statistics.service';
import { AchievementsService } from '../achievements/achievements.service';
import {
  ACHIEVEMENT_NOT_FOUND,
  PLAYER_STATS_NOT_FOUND,
} from '@error-messages/db-error-messages.constants';
import { applyOperatorToNumbers } from '../../common/utils/apply-operator-to-numbers.util';
import { MathOperator } from '../../common/types/math-operator.type';
import { PlayerAchievementsRepository } from './player-achievements.repository';
import { ThrowIf } from '../../common/utils/throw-if.util';

@Injectable()
export class PlayerAchievementsService {
  constructor(
    private readonly achievementsService: AchievementsService,
    @Inject(forwardRef(() => PlayerStatisticsService))
    private readonly playerStatisticsService: PlayerStatisticsService,
    private readonly repository: PlayerAchievementsRepository,
  ) {}

  async getPlayerAchievementProgress(
    input: GetPlayerAchievementProgressRequest,
  ): Promise<GetPlayerAchievementProgressResponse> {
    const playerStats = (
      await this.playerStatisticsService.getPlayerStatistics({
        playerId: input.playerId,
      })
    ).playerStatistics;
    ThrowIf.notFound(playerStats, PLAYER_STATS_NOT_FOUND);

    const achievementId = input.achievementId;

    const achievement = (
      await this.achievementsService.getAchievementById({ id: achievementId })
    ).achievement;

    ThrowIf.notFound(achievement, ACHIEVEMENT_NOT_FOUND);

    const stat = achievement.statTarget as keyof typeof playerStats;

    return {
      current: playerStats[stat],
      required: achievement.threshold,
    };
  }

  async getAllPlayerAchievements(
    input: GetAllPlayerAchievementsRequest,
  ): Promise<GetAllPlayerAchievementsResponse> {
    const fromDb = await this.repository.findPlayerAchievements(input.playerId);

    const playerAchievements = fromDb.map((pa) => ({
      id: pa.achievement.id,
      playerId: pa.playerId,
      title: pa.achievement.title,
      description: pa.achievement.description,
      achievedAt: pa.achievedAt,
    }));

    return { playerAchievements };
  }

  async giveAchievementToPlayer(achievementId: number, playerId: number) {
    const existing = await this.repository.findPlayerAchievement(
      playerId,
      achievementId,
    );
    if (existing) return;
    return this.repository.createPlayerAchievement(playerId, achievementId);
  }

  async handleStatisticsUpdate(payload: {
    playerId: number;
    stat: string;
    updatedValue: number;
  }) {
    const achievements = await this.repository.findAchievementsByStatTarget(
      payload.stat,
    );
    if (!achievements?.length) return;

    for (const achievement of achievements) {
      const satisfied = applyOperatorToNumbers(
        achievement.threshold,
        payload.updatedValue,
        achievement.operator as MathOperator,
      );
      if (satisfied) {
        await this.giveAchievementToPlayer(payload.playerId, achievement.id);
      }
    }
  }
}
