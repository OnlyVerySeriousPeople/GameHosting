import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { DatabaseModule } from '../../database/database.module';
import { PlayersRepository } from './players.repository';
import { PlayerStatisticsModule } from '../player-statistics/player-statistics.module';

@Module({
  imports: [DatabaseModule, PlayerStatisticsModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
