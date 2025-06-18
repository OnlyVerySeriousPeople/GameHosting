import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class FeaturedGamesRepository {
  constructor(private readonly database: DatabaseService) {}

  async createFeaturedGame(playerId: number, gameId: number) {
    return this.database.featuredGame.create({
      data: { playerId, gameId },
    });
  }

  async findFeaturedGamesByPlayerId(playerId: number) {
    return this.database.featuredGame.findMany({
      where: { playerId },
    });
  }
}
