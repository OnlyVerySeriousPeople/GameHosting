import { Injectable } from '@nestjs/common';
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  DeletePlayerRequest,
  DeletePlayerResponse,
  GetAllPlayersResponse,
  GetPlayerRequest,
  GetPlayerResponse,
  Player,
  UpdatePlayerRequest,
  UpdatePlayerResponse,
} from '@proto/types';
import { simplifyFieldMaskInUpdateInput } from '../../common/utils/update-input-converter.util';
import { PlayersRepository } from './players.repository';
import { PLAYER_NOT_FOUND } from '@error-messages/db-error-messages.constants';
import { INVALID_UPDATE_MASK } from '@error-messages/input-error-messages.constants';
import { ThrowIf } from '../../common/utils/throw-if.util';

@Injectable()
export class PlayersService {
  constructor(private readonly playersRepository: PlayersRepository) {}

  async createPlayer(
    createPlayerInput: CreatePlayerRequest,
  ): Promise<CreatePlayerResponse> {
    return {
      player: await this.playersRepository.create(createPlayerInput),
    };
  }

  async getPlayer(
    getPlayerInput: GetPlayerRequest,
  ): Promise<GetPlayerResponse> {
    const player = await this.playersRepository.findUnique(
      getPlayerInput,
      getPlayerInput.expanded,
    );

    ThrowIf.notFound(player, PLAYER_NOT_FOUND);

    return { player };
  }

  async getAllPlayers(): Promise<GetAllPlayersResponse> {
    const players = await this.playersRepository.findAll();
    return { players };
  }

  async updatePlayer(
    updatePlayerInput: UpdatePlayerRequest,
  ): Promise<UpdatePlayerResponse> {
    const { player, updateMask } =
      simplifyFieldMaskInUpdateInput(updatePlayerInput);

    const dataToUpdate: Partial<Player> = {};
    for (const key of updateMask!) {
      ThrowIf.invalidArgument(player![key], INVALID_UPDATE_MASK);
      dataToUpdate[key] = player![key] as Partial<Player>;
    }

    const updatedPlayer = await this.playersRepository.update(
      player!.id,
      dataToUpdate,
    );

    return { player: updatedPlayer };
  }

  async deletePlayer(
    deletePlayerInput: DeletePlayerRequest,
  ): Promise<DeletePlayerResponse> {
    const deletedPlayer =
      await this.playersRepository.delete(deletePlayerInput);
    return { success: !!deletedPlayer };
  }
}
