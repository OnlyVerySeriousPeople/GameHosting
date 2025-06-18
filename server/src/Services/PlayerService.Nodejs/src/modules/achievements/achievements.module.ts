import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { DatabaseModule } from '../../database/database.module';
import { AchievementsRepository } from './achievements.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepository],
  exports: [AchievementsService],
})
export class AchievementsModule {}
