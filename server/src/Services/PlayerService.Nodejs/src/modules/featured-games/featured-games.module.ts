import { Module } from '@nestjs/common';
import { FeaturedGamesService } from './featured-games.service';
import { FeaturedGamesController } from './featured-games.controller';
import { DatabaseModule } from '../../database/database.module';
import { FeaturedGamesRepository } from './featured-games.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [FeaturedGamesController],
  providers: [FeaturedGamesService, FeaturedGamesRepository],
})
export class FeaturedGamesModule {}
