import { Controller } from '@nestjs/common';
import { FeaturedGamesService } from './featured-games.service';
import {
  AddGameToFeaturedRequest,
  AddGameToFeaturedResponse,
  FeaturedGameServiceController,
  FeaturedGameServiceControllerMethods,
  GetAllFeaturedGamesOfPlayerRequest,
  GetAllFeaturedGamesOfPlayerResponse,
} from '@proto/types';

@Controller()
@FeaturedGameServiceControllerMethods()
export class FeaturedGamesController implements FeaturedGameServiceController {
  constructor(private readonly featuredGamesService: FeaturedGamesService) {}

  addGameToFeatured(
    request: AddGameToFeaturedRequest,
  ): Promise<AddGameToFeaturedResponse> {
    return this.featuredGamesService.addGameToFeatured(request);
  }

  getAllFeaturedGamesOfPlayer(
    request: GetAllFeaturedGamesOfPlayerRequest,
  ): Promise<GetAllFeaturedGamesOfPlayerResponse> {
    return this.featuredGamesService.getAllFeaturedGamesOfPlayer(request);
  }
}
