import { Controller } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import {
  GetPlayerStatisticsRequest,
  GetPlayerStatisticsResponse,
  PlayerStatisticsServiceController,
  PlayerStatisticsServiceControllerMethods,
} from '@proto/types';

@Controller()
@PlayerStatisticsServiceControllerMethods()
export class PlayerStatisticsController
  implements PlayerStatisticsServiceController
{
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService,
  ) {}

  getPlayerStatistics(
    request: GetPlayerStatisticsRequest,
  ): Promise<GetPlayerStatisticsResponse> {
    return this.playerStatisticsService.getPlayerStatistics(request);
  }
}
