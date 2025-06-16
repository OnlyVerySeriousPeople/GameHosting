import { Module, forwardRef } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import { PlayerStatisticsController } from './player-statistics.controller';
import { DatabaseModule } from '../../database/database.module';
import { StatisticsUpdateHandler } from './handlers/statistics-update.handler';
import { PlayerAchievementsModule } from '../player-achievements/player-achievements.module';
import { PlayerStatisticsRepository } from './player-statistics.repository';

@Module({
  imports: [DatabaseModule, forwardRef(() => PlayerAchievementsModule)],
  controllers: [PlayerStatisticsController, StatisticsUpdateHandler],
  providers: [PlayerStatisticsService, PlayerStatisticsRepository],
  exports: [PlayerStatisticsService],
})
export class PlayerStatisticsModule {}
