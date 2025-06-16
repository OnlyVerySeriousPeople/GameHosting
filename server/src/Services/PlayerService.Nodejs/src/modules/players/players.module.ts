import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { DatabaseModule } from '../../database/database.module';
import { PlayersRepository } from './players.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
