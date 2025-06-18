import { Controller } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

import {
  AchievementServiceController,
  AchievementServiceControllerMethods,
  GetAchievementByIdRequest,
  GetAchievementByTitleRequest,
  GetAchievementResponse,
  GetAllAchievementsResponse,
} from '@proto/types';

@Controller()
@AchievementServiceControllerMethods()
export class AchievementsController implements AchievementServiceController {
  constructor(private readonly achievementsService: AchievementsService) {}

  getAchievementById(
    request: GetAchievementByIdRequest,
  ): Promise<GetAchievementResponse> {
    return this.achievementsService.getAchievementById(request);
  }

  getAchievementByTitle(
    request: GetAchievementByTitleRequest,
  ): Promise<GetAchievementResponse> {
    return this.achievementsService.getAchievementByTitle(request);
  }

  getAllAchievements(): Promise<GetAllAchievementsResponse> {
    return this.achievementsService.getAllAchievements();
  }
}
