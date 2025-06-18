import { Controller } from '@nestjs/common';
import { PlayerAchievementsService } from './player-achievements.service';
import {
  GetAllPlayerAchievementsRequest,
  GetPlayerAchievementProgressRequest,
  PlayerAchievementServiceController,
  PlayerAchievementServiceControllerMethods,
} from '@proto/types';

@Controller()
@PlayerAchievementServiceControllerMethods()
export class PlayerAchievementsController
  implements PlayerAchievementServiceController
{
  constructor(
    private readonly playerAchievementsService: PlayerAchievementsService,
  ) {}

  getPlayerAchievementProgress(
    getPlayerAchievementProgressRequest: GetPlayerAchievementProgressRequest,
  ) {
    return this.playerAchievementsService.getPlayerAchievementProgress(
      getPlayerAchievementProgressRequest,
    );
  }

  getPlayerAllAchievements(
    getPlayerAllAchievementsRequest: GetAllPlayerAchievementsRequest,
  ) {
    return this.playerAchievementsService.getAllPlayerAchievements(
      getPlayerAllAchievementsRequest,
    );
  }
}
