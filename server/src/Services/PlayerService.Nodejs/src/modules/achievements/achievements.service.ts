import { Injectable } from '@nestjs/common';
import {
  GetAchievementByIdRequest,
  GetAchievementByTitleRequest,
  GetAchievementResponse,
  GetAllAchievementsResponse,
} from '@proto/types';
import { AchievementsRepository } from './achievements.repository';
import { ThrowIf } from '../../common/utils/throw-if.util';
import { ACHIEVEMENT_NOT_FOUND } from '@error-messages/db-error-messages.constants';

@Injectable()
export class AchievementsService {
  constructor(private readonly achievementsRepo: AchievementsRepository) {}

  async getAchievementById(
    request: GetAchievementByIdRequest,
  ): Promise<GetAchievementResponse> {
    const achievement = await this.achievementsRepo.findById(request.id);
    ThrowIf.notFound(achievement, ACHIEVEMENT_NOT_FOUND);
    return { achievement };
  }

  async getAchievementByTitle(
    request: GetAchievementByTitleRequest,
  ): Promise<GetAchievementResponse> {
    const achievement = await this.achievementsRepo.findByTitle(request.title);
    ThrowIf.notFound(achievement, ACHIEVEMENT_NOT_FOUND);
    return { achievement };
  }

  async getAllAchievements(): Promise<GetAllAchievementsResponse> {
    const achievements = await this.achievementsRepo.findAll();
    return { achievements };
  }
}
