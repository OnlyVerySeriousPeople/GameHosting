import { Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { PlayerAchievementsModule } from './modules/player-achievements/player-achievements.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { PlayerStatisticsModule } from './modules/player-statistics/player-statistics.module';
import { FeaturedGamesModule } from './modules/featured-games/featured-games.module';

@Module({
  imports: [
    PlayersModule,
    PlayerStatisticsModule,
    PlayerAchievementsModule,
    AchievementsModule,
    FeaturedGamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
