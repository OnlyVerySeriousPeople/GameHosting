import { Injectable } from '@nestjs/common';
import {
  AddGameToFeaturedRequest,
  AddGameToFeaturedResponse,
  GetAllFeaturedGamesOfPlayerRequest,
  GetAllFeaturedGamesOfPlayerResponse,
} from '@proto/types';
import { FeaturedGamesRepository } from './featured-games.repository';

@Injectable()
export class FeaturedGamesService {
  constructor(private readonly repository: FeaturedGamesRepository) {}

  async addGameToFeatured(
    request: AddGameToFeaturedRequest,
  ): Promise<AddGameToFeaturedResponse> {
    await this.repository.createFeaturedGame(request.playerId, request.gameId);
    return { success: true };
  }

  async getAllFeaturedGamesOfPlayer(
    request: GetAllFeaturedGamesOfPlayerRequest,
  ): Promise<GetAllFeaturedGamesOfPlayerResponse> {
    const featuredGames = await this.repository.findFeaturedGamesByPlayerId(
      request.playerId,
    );
    const gameIds = featuredGames.map((record) => record.gameId);
    return { gameIds };
  }
}
