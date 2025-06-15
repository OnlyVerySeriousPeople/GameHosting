import { Controller } from '@nestjs/common';
import { PlayersService } from './players.service';
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  DeletePlayerRequest,
  DeletePlayerResponse,
  GetPlayerRequest,
  GetPlayerResponse,
  GetAllPlayersResponse,
  PlayerServiceController,
  PlayerServiceControllerMethods,
  UpdatePlayerRequest,
  UpdatePlayerResponse,
} from '@proto/types';

@Controller()
@PlayerServiceControllerMethods()
export class PlayersController implements PlayerServiceController {
  constructor(private readonly playersService: PlayersService) {}

  createPlayer(request: CreatePlayerRequest): Promise<CreatePlayerResponse> {
    return this.playersService.createPlayer(request);
  }

  getPlayer(request: GetPlayerRequest): Promise<GetPlayerResponse> {
    return this.playersService.getPlayer(request);
  }

  getAllPlayers(): Promise<GetAllPlayersResponse> {
    return this.playersService.getAllPlayers();
  }

  updatePlayer(request: UpdatePlayerRequest): Promise<UpdatePlayerResponse> {
    return this.playersService.updatePlayer(request);
  }

  deletePlayer(request: DeletePlayerRequest): Promise<DeletePlayerResponse> {
    return this.playersService.deletePlayer(request);
  }
}
