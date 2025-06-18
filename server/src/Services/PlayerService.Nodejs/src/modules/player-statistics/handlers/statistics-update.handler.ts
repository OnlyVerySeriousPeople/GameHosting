import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UpdatePlayerStatisticDto } from '../dto/update-statistic.dto';
import { PlayerStatisticsService } from '../player-statistics.service';

@Controller()
export class StatisticsUpdateHandler {
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService,
  ) {}

  @EventPattern('player.stats.update')
  async handleStatisticUpdate(
    @Payload() updateStatisticInput: UpdatePlayerStatisticDto,
  ) {
    await this.playerStatisticsService.updatePlayerStatistic(
      updateStatisticInput,
    );
  }
}
