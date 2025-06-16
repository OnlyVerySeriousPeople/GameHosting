import { Injectable } from '@nestjs/common';
import {
  GetPlayerStatisticsRequest,
  GetPlayerStatisticsResponse,
} from '@proto/types';
import { UpdatePlayerStatisticDto } from './dto/update-statistic.dto';
import {
  PLAYER_STATS_NOT_FOUND,
  STAT_NOT_FOUND,
} from '@error-messages/db-error-messages.constants';
import { PlayerStatisticsRepository } from './player-statistics.repository';
import { Prisma } from '@prisma/client';
import { ThrowIf } from '../../common/utils/throw-if.util';

@Injectable()
export class PlayerStatisticsService {
  constructor(private readonly repository: PlayerStatisticsRepository) {}

  async updatePlayerStatistic(updateStatisticInput: UpdatePlayerStatisticDto) {
    const { playerId, statTarget, operation, value } = updateStatisticInput;

    const currentStats = await this.repository.findByPlayerId(playerId);
    ThrowIf.notFound(currentStats, PLAYER_STATS_NOT_FOUND);

    ThrowIf.notFound(currentStats[statTarget], STAT_NOT_FOUND);

    const stat = statTarget as keyof typeof currentStats;
    const currentValue = currentStats[stat];
    const updatedValue =
      operation === 'increment' ? currentValue + value : currentValue - value;

    await this.repository.updateStat(playerId, stat, updatedValue);
  }

  async createPlayerStatistics(
    playerId: number,
    tx?: Prisma.TransactionClient,
  ) {
    return this.repository.create(playerId, tx);
  }

  async getPlayerStatistics(
    getPlayerStatisticsInput: GetPlayerStatisticsRequest,
  ): Promise<GetPlayerStatisticsResponse> {
    const playerStatistics = await this.repository.findByPlayerId(
      getPlayerStatisticsInput.playerId,
    );
    ThrowIf.notFound(playerStatistics, PLAYER_STATS_NOT_FOUND);
    return { playerStatistics };
  }
}
