import { forwardRef, Module } from '@nestjs/common';
import { PlayerAchievementsService } from './player-achievements.service';
import { PlayerAchievementsController } from './player-achievements.controller';
import { PlayerStatisticsModule } from '../player-statistics/player-statistics.module';
import { DatabaseModule } from '../../database/database.module';
import { PlayerAchievementsRepository } from './player-achievements.repository';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => PlayerStatisticsModule),
    AchievementsModule,
  ],
  controllers: [PlayerAchievementsController],
  providers: [PlayerAchievementsService, PlayerAchievementsRepository],
  exports: [PlayerAchievementsService],
})
export class PlayerAchievementsModule {}
