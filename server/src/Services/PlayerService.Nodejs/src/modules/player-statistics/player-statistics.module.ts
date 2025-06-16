import { Module } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import { PlayerStatisticsController } from './player-statistics.controller';
import { DatabaseModule } from '../../database/database.module';
import { StatisticsUpdateHandler } from './handlers/statistics-update.handler';
import { PlayerStatisticsRepository } from './player-statistics.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayerStatisticsController, StatisticsUpdateHandler],
  providers: [PlayerStatisticsService, PlayerStatisticsRepository],
  exports: [PlayerStatisticsService],
})
export class PlayerStatisticsModule {}
