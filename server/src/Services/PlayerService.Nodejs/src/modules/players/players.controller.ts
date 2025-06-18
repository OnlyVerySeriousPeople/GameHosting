import { Controller, UseFilters } from '@nestjs/common';
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
import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { GrpcValidate } from '../../common/decorators/grpc-validate.decorator';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player/update-player.dto';

@UseFilters(RpcExceptionFilter)
@Controller()
@PlayerServiceControllerMethods()
export class PlayersController implements PlayerServiceController {
  constructor(private readonly playersService: PlayersService) {}

  @GrpcValidate(CreatePlayerDto)
  createPlayer(request: CreatePlayerRequest): Promise<CreatePlayerResponse> {
    return this.playersService.createPlayer(request);
  }

  getPlayer(request: GetPlayerRequest): Promise<GetPlayerResponse> {
    return this.playersService.getPlayer(request);
  }

  getAllPlayers(): Promise<GetAllPlayersResponse> {
    return this.playersService.getAllPlayers();
  }

  @GrpcValidate(UpdatePlayerDto)
  updatePlayer(request: UpdatePlayerRequest): Promise<UpdatePlayerResponse> {
    return this.playersService.updatePlayer(request);
  }

  deletePlayer(request: DeletePlayerRequest): Promise<DeletePlayerResponse> {
    return this.playersService.deletePlayer(request);
  }
}
